// Em: src/server/api/routers/cliente.ts
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const clienteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.cliente.findMany({
      orderBy: { nome: "asc" },
    });
  }),
});