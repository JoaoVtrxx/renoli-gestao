import { veiculoRouter } from "~/server/api/routers/veiculo";
import { clienteRouter } from "~/server/api/routers/cliente";
import { profissaoRouter } from "~/server/api/routers/profissao";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  veiculo: veiculoRouter,
  cliente: clienteRouter,
  profissao: profissaoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
