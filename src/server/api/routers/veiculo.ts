import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { StatusVeiculo, TipoTransacao } from "@prisma/client";

export const veiculoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        // Informações Básicas
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

        // Financeiro
        precoCusto: z.number().optional(),
        precoVenda: z.number(),

        // Descrições
        descricaoAnuncio: z.string().optional(),
        observacoesInternas: z.string().optional(),

        // Status e Transação
        status: z.nativeEnum(StatusVeiculo),
        tipoTransacao: z.nativeEnum(TipoTransacao),
        
        // Relações
        clienteIdVendedor: z.string(),
      })
    )
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
});