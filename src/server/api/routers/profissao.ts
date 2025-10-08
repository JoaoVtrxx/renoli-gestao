import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profissaoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.profissao.findMany({
      orderBy: { nome: "asc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(2, "O nome da profissão é obrigatório"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.profissao.create({
        data: {
          nome: input.nome,
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
      return ctx.db.profissao.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
