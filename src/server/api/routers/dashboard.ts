import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // 1. Total de veículos em estoque (status DISPONIVEL)
    const totalVeiculosEmEstoque = await ctx.db.veiculo.count({
      where: {
        status: "DISPONIVEL",
      },
    });

    // 2. Valor total do estoque (soma dos preços de venda dos veículos disponíveis)
    const valorTotalEstoqueResult = await ctx.db.veiculo.aggregate({
      _sum: {
        precoVenda: true,
      },
      where: {
        status: "DISPONIVEL",
      },
    });

    const valorTotalEstoque = valorTotalEstoqueResult._sum.precoVenda ?? 0;

    // 3. Veículos recém adicionados (5 mais recentes)
    const veiculosRecemAdicionados = await ctx.db.veiculo.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vendedor: true,
      },
    });

    // 4. Veículos precisando atenção (sem fotos e disponíveis)
    const veiculosPrecisandoAtencao = await ctx.db.veiculo.count({
      where: {
        status: "DISPONIVEL",
        fotos: {
          isEmpty: true,
        },
      },
    });

    return {
      totalVeiculosEmEstoque,
      valorTotalEstoque,
      veiculosRecemAdicionados,
      veiculosPrecisandoAtencao,
    };
  }),
});