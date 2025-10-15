import { veiculoRouter } from "~/server/api/routers/veiculo";
import { clienteRouter } from "~/server/api/routers/cliente";
import { profissaoRouter } from "~/server/api/routers/profissao";
import { estadoCivilRouter } from "~/server/api/routers/estadoCivil";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { relatorioRouter } from "~/server/api/routers/relatorio";
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
  estadoCivil: estadoCivilRouter,
  dashboard: dashboardRouter,
  relatorio: relatorioRouter,
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
