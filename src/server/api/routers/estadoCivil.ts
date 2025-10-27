import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const estadoCivilRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.estadoCivil.findMany({
      orderBy: { nome: "asc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(2, "O nome do estado civil é obrigatório"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.estadoCivil.create({
        data: {
          nome: input.nome,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nome: z.string().min(2, "O nome do estado civil é obrigatório"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.estadoCivil.update({
        where: {
          id: input.id,
        },
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
      return ctx.db.estadoCivil.delete({
        where: {
          id: input.id,
        },
      });
    }),
});