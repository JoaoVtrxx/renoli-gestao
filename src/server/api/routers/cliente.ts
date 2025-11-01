// Em: src/server/api/routers/cliente.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createClienteSchema = z.object({
  // Informações Básicas
  nome: z.string().min(2, "O nome é obrigatório"),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  dataNascimento: z.date().optional(),

  // Contato
  celular: z.string().min(10, "O celular é obrigatório"),
  telefoneFixo: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),

  // Endereço
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),

  // Marketing e Observações
  aceitaMarketing: z.boolean().default(true),
  observacoesNegocios: z.string().optional(),

  // Relações
  profissaoId: z.string().optional().nullable().transform(val => val === "" ? null : val),
  estadoCivilId: z.string().optional().nullable().transform(val => val === "" ? null : val),
});

export const clienteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        termoBusca: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.termoBusca
        ? {
            OR: [
              {
                nome: {
                  contains: input.termoBusca,
                  mode: "insensitive" as const,
                },
              },
              {
                cpf: {
                  contains: input.termoBusca,
                  mode: "insensitive" as const,
                },
              },
              {
                celular: {
                  contains: input.termoBusca,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {};

      // Buscar clientes paginados
      const clientes = await ctx.db.cliente.findMany({
        where,
        orderBy: { nome: "asc" },
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      });

      // Contar total de clientes que correspondem ao filtro
      const totalClientes = await ctx.db.cliente.count({
        where,
      });

      return {
        clientes,
        totalClientes,
      };
    }),

  create: protectedProcedure
    .input(createClienteSchema)
    .mutation(async ({ ctx, input }) => {
      // Tratamento especial para email vazio
      const emailToSave = input.email === "" ? undefined : input.email;
      // Tratamento especial para profissaoId vazio/null
      const profissaoIdToSave = input.profissaoId ?? undefined;
      // Tratamento especial para estadoCivilId vazio/null
      const estadoCivilIdToSave = input.estadoCivilId ?? undefined;

      return ctx.db.cliente.create({
        data: {
          ...input,
          email: emailToSave,
          profissaoId: profissaoIdToSave,
          estadoCivilId: estadoCivilIdToSave,
        },
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.cliente.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          profissao: true,
          estadoCivil: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      createClienteSchema.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Tratamento especial para email vazio
      const emailToSave = updateData.email === "" ? undefined : updateData.email;
      // Tratamento especial para profissaoId vazio/null
      const profissaoIdToSave = updateData.profissaoId ?? undefined;
      // Tratamento especial para estadoCivilId vazio/null
      const estadoCivilIdToSave = updateData.estadoCivilId ?? undefined;

      return ctx.db.cliente.update({
        where: {
          id,
        },
        data: {
          ...updateData,
          email: emailToSave,
          profissaoId: profissaoIdToSave,
          estadoCivilId: estadoCivilIdToSave,
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
      return ctx.db.cliente.delete({
        where: {
          id: input.id,
        },
      });
    }),

  exportEtiquetas: protectedProcedure
    .input(
      z.object({
        termoBusca: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }): Promise<string> => {
      // Construir a mesma cláusula where que a getAll usa
      const where = input.termoBusca
        ? {
            OR: [
              {
                nome: {
                  contains: input.termoBusca,
                  mode: "insensitive" as const,
                },
              },
              {
                cpf: {
                  contains: input.termoBusca,
                  mode: "insensitive" as const,
                },
              },
              {
                celular: {
                  contains: input.termoBusca,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {};

      // Buscar clientes com apenas os campos necessários para etiquetas
      const clientes = await ctx.db.cliente.findMany({
        where,
        select: {
          nome: true,
          rua: true,
          numero: true,
          complemento: true,
          bairro: true,
          cidade: true,
          estado: true,
          cep: true,
        },
        orderBy: { nome: "asc" },
      });

      // Função para escapar aspas duplas em CSV
      const escapeCsvValue = (value: string | null | undefined): string => {
        if (!value) return "";
        // Escapar aspas duplas duplicando-as e envolver em aspas duplas
        return `"${value.replace(/"/g, '""')}"`;
      };

      // Criar string CSV
      let csvContent = '"Nome","Endereço","Bairro","Cidade/UF","CEP"\n';

      for (const cliente of clientes) {
        // Formatar endereço completo
        const enderecoParts = [
          cliente.rua,
          cliente.numero,
          cliente.complemento
        ].filter(Boolean); // Remove valores vazios/null
        
        const enderecoCompleto = enderecoParts.join(", ");
        
        // Formatar cidade/UF
        const cidadeUf = [cliente.cidade, cliente.estado]
          .filter(Boolean)
          .join("/");

        // Adicionar linha ao CSV
        csvContent += [
          escapeCsvValue(cliente.nome),
          escapeCsvValue(enderecoCompleto),
          escapeCsvValue(cliente.bairro),
          escapeCsvValue(cidadeUf),
          escapeCsvValue(cliente.cep),
        ].join(",") + "\n";
      }

      return csvContent;
    }),
});