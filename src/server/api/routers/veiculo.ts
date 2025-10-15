import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { StatusVeiculo, TipoTransacao } from "@prisma/client";
import { supabase } from "~/server/supabase";

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
  precoCusto: z.number().optional(),
  precoVenda: z.number(),
  descricaoAnuncio: z.string().optional(),
  observacoesInternas: z.string().optional(),
  status: z.nativeEnum(StatusVeiculo),
  tipoTransacao: z.nativeEnum(TipoTransacao),
  clienteIdVendedor: z.string(),
  fotos: z.array(z.string()).default([]),
});

export const veiculoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(veiculoInputSchema) // 2. USAMOS O SCHEMA BASE DIRETAMENTE
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { clienteIdVendedor, ...veiculoData } = input;

      return ctx.db.veiculo.create({
        data: {
          ...veiculoData,
          clienteIdVendedor,
          userId,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.veiculo.findMany({
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
});