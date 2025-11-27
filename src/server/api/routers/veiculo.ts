import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { StatusVeiculo, TipoTransacao } from "@prisma/client";
import { supabase } from "~/server/supabase";

// Desabilita worker externo para evitar erros de caminho no Windows/Vercel
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

/**
 * Extrai texto de um PDF usando pdfjs-dist (legacy build) sem worker externo
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  // Defensive Coding: Só injeta se o ambiente não tiver (Vercel às vezes remove)
  if (!(global as any).DOMMatrix) {
    // @ts-expect-error - Mock simples para evitar crash
    (global as any).DOMMatrix = class DOMMatrix {
      constructor() { return this; }
      toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
      disableWorker: true,      // Roda na thread principal
      useWorkerFetch: false,    // Não busca scripts externos
      isEvalSupported: false
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const doc = await loadingTask.promise;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const page = await doc.getPage(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const content = await page.getTextContent();

    // Mantém o separador pipe "|" vital para o regex posicional
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return content.items.map((item: any) => item.str).join(' | ').trim();
  } catch (error) {
    console.error("Erro no parsePDF:", error);
    throw new Error(`Falha ao ler PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// 1. CRIAMOS UM SCHEMA BASE REUTILIZÁVEL
const veiculoInputSchema = z.object({
  placa: z.string().min(7, "A placa deve ter no mínimo 7 caracteres"),
  marca: z.string().min(2, "A marca é obrigatória"),
  modelo: z.string().min(1, "O modelo é obrigatório"),
  versao: z.string().optional(),
  anoFabricacao: z.number().int().min(1900),
  anoModelo: z.number().int().min(1900),
  cor: z.string().min(3, "A cor é obrigatória"),
  km: z.number().int().min(0),
  cambio: z.string(),
  combustivel: z.string(),
  portas: z.number().int(),
  chassi: z.string().optional(),
  renavam: z.string().optional(),
  tipo: z.string().optional(),
  localRegistro: z.string().optional(),
  precoCusto: z.number().optional(),
  precoVenda: z.number(),
  descricaoAnuncio: z.string().optional(),
  observacoesInternas: z.string().optional(),
  status: z.nativeEnum(StatusVeiculo),
  tipoTransacao: z.nativeEnum(TipoTransacao),
  clienteIdVendedor: z.string(),
  fotos: z.array(z.string()).default([]),
});

/**
 * Função auxiliar POSICIONAL FINAL para extrair dados do CRLV
 * Atualização: Inclui 'Tipo' e 'Local de Registro'
 */
function parseCRLVText(text: string) {
  console.log("--- INICIANDO EXTRAÇÃO POSICIONAL COMPLETA ---");

  const items = text
    .split('|')
    .map(item => item.trim())
    .filter(item => item.length > 0); // Remove vazios para garantir a ordem

  // ÂNCORA: RENAVAM (11 dígitos)
  const renavamIndex = items.findIndex(item => /^\d{11}$/.test(item));

  if (renavamIndex === -1) {
    return {
      placa: null, renavam: null, chassi: null, marca: null, 
      modelo: null, versao: null, anoFabricacao: null, anoModelo: null, 
      cor: null, combustivel: null, tipo: null, localRegistro: null
    };
  }

  // Extração baseada em OFFSETS fixos a partir do Renavam
  // Mapeamento baseado no log 'debug-crlv.txt'
  const data = {
    renavam: items[renavamIndex],          // +0
    placa: items[renavamIndex + 1],        // +1
    anoFabricacao: parseInt(items[renavamIndex + 3] ?? ""), // +3
    anoModelo: parseInt(items[renavamIndex + 4] ?? ""),     // +4
    marcaModeloVersao: items[renavamIndex + 8],       // +8
    tipo: items[renavamIndex + 9],         // +9 (Novo: Ex: PASSAGEIRO AUTOMOVEL)
    chassi: items[renavamIndex + 11],      // +11
    cor: items[renavamIndex + 12],         // +12
    combustivel: items[renavamIndex + 13], // +13
    localRegistro: items[renavamIndex + 25] // +25 (Novo: Ex: SANTA MARIA RS)
  };

  // Lógica de Separação: Marca / Modelo / Versão
  let marca = null;
  let modelo = null;
  let versao = null;

  if (data.marcaModeloVersao?.includes('/')) {
    const parts = data.marcaModeloVersao.split('/');
    marca = parts[0]?.trim(); // "TOYOTA"
    
    const restoModelo = parts[1]?.trim(); // "COROLLA SEG18VVT"
    
    // Separa Modelo da Versão pelo primeiro espaço
    if (restoModelo) {
      const primeiroEspaco = restoModelo.indexOf(' ');
      if (primeiroEspaco > -1) {
        modelo = restoModelo.substring(0, primeiroEspaco).trim();
        versao = restoModelo.substring(primeiroEspaco + 1).trim();
      } else {
        modelo = restoModelo;
      }
    }
  } else {
    marca = data.marcaModeloVersao;
  }

  // Limpeza do campo 'Tipo' (Opcional: pode vir sujo se o layout variar minimamente)
  // Geralmente "PASSAGEIRO AUTOMOVEL" vem limpo, mas é bom garantir.
  const tipoLimpo = data.tipo?.replace(/[^\w\s]/gi, '').trim();

  return {
    placa: data.placa?.toUpperCase() ?? null,
    renavam: data.renavam ?? null,
    chassi: data.chassi?.toUpperCase() ?? null,
    marca: marca?.toUpperCase() ?? null,
    modelo: modelo?.toUpperCase() ?? null,
    versao: versao?.toUpperCase() ?? null,
    anoFabricacao: isNaN(data.anoFabricacao) ? null : data.anoFabricacao,
    anoModelo: isNaN(data.anoModelo) ? null : data.anoModelo,
    cor: data.cor?.toUpperCase() ?? null,
    combustivel: data.combustivel?.toUpperCase() ?? null,
    tipo: tipoLimpo?.toUpperCase() ?? null,       // Novo Campo Retornado
    localRegistro: data.localRegistro?.toUpperCase() ?? null // Novo Campo Retornado
  };
}

export const veiculoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(veiculoInputSchema) // 2. USAMOS O SCHEMA BASE DIRETAMENTE
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { clienteIdVendedor, ...veiculoData } = input;

      // Verificar se o usuário existe
      const userExists = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new Error("Sessão inválida. Por favor, faça logout e login novamente.");
      }

      // Verificar se o cliente vendedor existe
      const clienteExists = await ctx.db.cliente.findUnique({
        where: { id: clienteIdVendedor },
      });

      if (!clienteExists) {
        throw new Error("Cliente vendedor não encontrado. Por favor, selecione um cliente válido.");
      }

      return ctx.db.veiculo.create({
        data: {
          ...veiculoData,
          clienteIdVendedor,
          userId,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        termoBusca: z.string().optional(),
        filtroStatus: z.nativeEnum(StatusVeiculo).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Construir cláusula where dinamicamente
      const where: Prisma.VeiculoWhereInput = {};

      // Filtro por status
      if (input?.filtroStatus) {
        where.status = input.filtroStatus;
      }

      // Busca por termo (marca, modelo, placa)
      if (input?.termoBusca) {
        where.OR = [
          {
            marca: {
              contains: input.termoBusca,
              mode: "insensitive",
            },
          },
          {
            modelo: {
              contains: input.termoBusca,
              mode: "insensitive",
            },
          },
          {
            placa: {
              contains: input.termoBusca,
              mode: "insensitive",
            },
          },
        ];
      }

      return ctx.db.veiculo.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          vendedor: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.veiculo.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          vendedor: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      veiculoInputSchema.extend({ // 3. ESTENDEMOS O SCHEMA BASE, ADICIONANDO O ID
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...veiculoData } = input;

      return ctx.db.veiculo.update({
        where: {
          id,
        },
        data: {
          ...veiculoData,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.veiculo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Extrair extensão do tipo de arquivo (ex: "image/jpeg" -> "jpeg")
      const extension = input.fileType.split("/")[1] ?? "jpg";

      // Gerar nome único usando timestamp + número aleatório
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;

      // Criar presigned URL para upload
      const { data, error } = await supabase.storage
        .from("fotos-veiculos")
        .createSignedUploadUrl(uniqueFileName);

      if (error) {
        throw new Error(`Erro ao gerar URL de upload: ${error.message}`);
      }

      return {
        url: data.signedUrl,
        path: data.path,
      };
    }),

  parseDocument: protectedProcedure
    .input(
      z.object({
        pdfBase64: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Converter base64 para Buffer
        const pdfBuffer = Buffer.from(input.pdfBase64, "base64");
        console.log("PDF Buffer criado, tamanho:", pdfBuffer.length);

        // Extrair texto do PDF (agora retorna string diretamente)
        const text = await parsePDF(pdfBuffer);
        console.log("Texto extraído, comprimento:", text.length);

        // Fazer parsing do texto extraído
        const parsedData = parseCRLVText(text);
        console.log("Dados parseados:", parsedData);

        // Validar se pelo menos alguns dados foram extraídos
        if (!parsedData.placa && !parsedData.chassi && !parsedData.renavam) {
          throw new Error(
            "Não foi possível extrair dados do documento. Verifique se o arquivo é um CRLV válido."
          );
        }

        return {
          success: true,
          data: parsedData,
        };
      } catch (error) {
        console.error("Erro ao processar PDF:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Erro ao processar o documento PDF"
        );
      }
    }),

  generateContract: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Buscar veículo com vendedor e comprador
      const veiculo = await ctx.db.veiculo.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          vendedor: true,
          comprador: true,
        },
      });

      // Função auxiliar para formatar dados ou retornar placeholder
      const format = (value: string | null | undefined, placeholder = "______________________") => {
        return value ?? placeholder;
      };

      const formatEndereco = (cliente: typeof veiculo.vendedor | null) => {
        if (!cliente) return "______________________";
        const partes = [];
        if (cliente.rua) {
          let endereco = cliente.rua;
          if (cliente.numero) endereco += `, ${cliente.numero}`;
          if (cliente.complemento) endereco += `, ${cliente.complemento}`;
          partes.push(endereco);
        }
        if (cliente.bairro) partes.push(cliente.bairro);
        if (cliente.cidade || cliente.estado) {
          const cidadeEstado = [cliente.cidade, cliente.estado].filter(Boolean).join(" - ");
          if (cidadeEstado) partes.push(cidadeEstado);
        }
        if (cliente.cep) partes.push(`CEP: ${cliente.cep}`);
        return partes.length > 0 ? partes.join(", ") : "______________________";
      };

      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const valorFormatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(veiculo.precoVenda));

      // Criar documento
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Título
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "CONTRATO PARTICULAR DE COMPRA E VENDA DE VEÍCULO",
                  bold: true,
                  size: 22,
                }),
              ],
            }),

            //PARTES CONTRATANTES
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "PARTES CONTRATANTES",
                  bold: true,
                  size: 20,
                }),
              ],
            }),

            // COMPRADOR
            new Paragraph({
              spacing: {after: 100 },
              children: [
                new TextRun({
                  text: "COMPRADOR:",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({

              children: [
              new TextRun({
                text: `Nome: `,
                size: 20,
                bold: true, 
              }),
              new TextRun({
                text: `${veiculo.comprador ? veiculo.comprador.nome : "______________________"}`,
                size: 20, 
              }),
            ],
            }),
            new Paragraph({

              children: [
              new TextRun({
                text: `CPF: `,
                size: 20, 
                bold: true,
              }),
              new TextRun({
                text: `${format(veiculo.comprador?.cpf)}`,
                size: 20, 
              }),
            ],
            }),
            new Paragraph({

              children: [
              new TextRun({
                text: `RG: `,
                size: 20, 
                bold: true,
              }),
              new TextRun({
                text: `${format(veiculo.comprador?.rg)}`,
                size: 20, 
              }),
            ],
            }),
            new Paragraph({
              children: [
              new TextRun({
                text: `Endereço: `,
                size: 20, 
                bold: true,
              }),
              new TextRun({
                text: `${formatEndereco(veiculo.comprador)}`,
                size: 20, 
              }),
            ],
            }),

            // VENDEDOR
            new Paragraph({
              spacing: {after: 100 },
              children: [
                new TextRun({
                  text: "VENDEDOR:",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({

              children: [
              new TextRun({
                text: `Nome: `,
                size: 20, 
                bold: true,
              }),
              new TextRun({
                text: `José Renê de Oliveira, brasileiro, residente.`,
                size: 20, 
              }),
            ],
            }),
            new Paragraph({

              children: [
              new TextRun({
                text: `CPF: `,
                size: 20, 
                bold: true,
              }),
              new TextRun({
                text: `380.783.760-49`,
                size: 20, 
              }),
            ],
            }),
            new Paragraph({
              children: [
              new TextRun({
                text: `RG: `,
                size: 20,
                bold: true,
              }),
              new TextRun({
                text: `1021038177`,
                size: 20,})
              ],
            }),
            new Paragraph({
              children: [
              new TextRun({
                text: `Endereço: `,
                size: 20, 
                bold: true,
              }),
              new TextRun({
                text: `Rua Professor Heitor da Graça Fernandes, n° 502, Santa Maria, RS.`,
                size: 20, 
              }),
            ],
            }),

            // OBJETO DO CONTRATO
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "OBJETO DO CONTRATO:",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                insideVertical: { style: BorderStyle.SINGLE, size: 1 },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Marca/Modelo:", bold: true })] })],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph(`${veiculo.marca}/${veiculo.modelo}`)],
                      width: { size: 70, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ano/Modelo:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(`${veiculo.anoFabricacao}/${veiculo.anoModelo}`)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Cor:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(veiculo.cor)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Placa:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(veiculo.placa)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chassi:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(format(veiculo.chassi))] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Renavam:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(format(veiculo.renavam))] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Registrado em:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(format(veiculo.localRegistro as string | null | undefined))] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tipo:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(format(veiculo.tipo as string | null | undefined))] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "KM Atual:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(`${veiculo.km} km`)] }),
                  ],
                }),
              ],
            }),

            // CONDIÇÕES DE PAGAMENTO
            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: "CONDIÇÕES DE PAGAMENTO:",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `O valor total da transação é de `,
                  size: 20,
              }),
                new TextRun({
                  text: `${valorFormatado} `,
                  bold: true,
                  size: 20,}), 
                new TextRun({
                  text: `a ser pago pelo Comprador ao Vendedor, da seguinte forma:`,
                  size: 20,
                }),
                ],  
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Depósito/Transferência: `,
                  size: 20,
                  bold: true
              }),
                new TextRun({
                  text: `O pagamento será efetuado na Caixa Econômica Federal (CEF), agência 0532, conta poupança n° 811.414.068-0, operação 013, em nome de José Renê de Oliveira, CPF n° 380.783.760-49.`,
                  size: 20,}), 
               
                ],  
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `CHAVE PIX: `,
                  size: 20,
                  bold: true
              }),
                new TextRun({
                  text: `55984028564 (Telefone).`,
                  size: 20,}), 
               
                ],  
            }),
            

            // RESPONSABILIDADES, POSSE E VÍCIOS
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "RESPONSABILIDADES, POSSE E VÍCIOS:",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({      
              children: [
                new TextRun({
                  text: `O Comprador assume a posse do veículo a partir do dia `, size: 20,}),
                new TextRun({
                  text: `${dataAtual}.`,
                  bold: true,
                  size: 20,
                  }),
                ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `A partir da data de posse (`,  
                  size: 20,
                }),
                new TextRun({
                  text: `${dataAtual}`, size: 20,
                  bold: true,
                }), 
                new TextRun({
                  text: `), o Comprador se torna civil e criminalmente responsável por todos os encargos, obrigações e ônus inerentes ao veículo, incluindo multas e a efetivação da transferência de propriedade junto aos órgãos competentes (DETRAN/RS).`,  
                  size: 20,
                }),
                ],
            }),
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({
                  text: `Multas e Débitos: `,  
                  bold: true,
                  size: 20,
                }),
                new TextRun({
                  text: `Eventuais multas, taxas, ou quaisquer outros débitos e embaraços (financeiros ou legais) ocorridos `, size: 20,
                }), 
                new TextRun({
                  text: `até o dia ${dataAtual}`,
                  size: 20,
                  bold: true,
                }),
                new TextRun({
                  text: `, são de exclusiva responsabilidade do Vendedor.`, size: 20,
                }),
                ],
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `O Comprador adquire o veículo no estado em que se encontra (ad corpus), conforme examinado por seu mecânico de confiança, e declara estar ciente de que o automóvel registra a quilometragem de `,  
                  size: 20,
                }),
                new TextRun({
                  text: `${veiculo.km ?? "__________"} km `, size: 20,
                  bold: true,
                }), 
                new TextRun({
                  text: `nesta data.`,
                  size: 20,
                }),

                ],
            }),


            // FORO
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "FORO:",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [

                new TextRun({
                  text: `Fica eleito o foro da Comarca de `,
                  size: 20,}),
                new TextRun({
                  text: `Santa Maria, Rio Grande do Sul`,
                  size: 20,
                  bold: true,
                }),
                new TextRun({
                  text: `, para dirimir quaisquer dúvidas ou questões oriundas deste Contrato, renunciando a qualquer outro, por mais privilegiado que seja.`,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [

                new TextRun({
                  text: `Por estarem justos e contratados, assinam o presente em 02 (duas) vias de igual teor e forma, para que produza seus efeitos legais e jurídicos.`,
                  size: 20,}),
                
              ],
            }),

            // ASSINATURAS
            new Paragraph({
              text: `Santa Maria, ${dataAtual}`,
              alignment: AlignmentType.RIGHT,
              spacing: { before: 100, after: 100 },
            }),
            new Paragraph({
              text: "________________________________________",
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: `José Renê de Oliveira`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: "Vendedor",
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "________________________________________",
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: `${veiculo.comprador?.nome ?? "______________________"}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: "Comprador",
              alignment: AlignmentType.CENTER,
            }),
          ],
        }],
      });

      // Gerar base64
      const base64 = await Packer.toBase64String(doc);
      const filename = `Contrato_${veiculo.placa}_${dataAtual.replace(/\//g, "-")}.docx`;

      return {
        base64,
        filename,
      };
    }),
});