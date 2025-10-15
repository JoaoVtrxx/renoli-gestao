import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const relatorioRouter = createTRPCRouter({
  getAniversariantesDoMes: protectedProcedure
    .input(z.object({
      mes: z.number().min(1).max(12),
    }))
    .query(async ({ ctx, input }) => {
      // Consulta SQL para buscar clientes aniversariantes do mês
      const clientes = await ctx.db.$queryRaw<Array<{
        id: string;
        nome: string;
        cpf: string | null;
        rg: string | null;
        dataNascimento: Date | null;
        celular: string;
        telefoneFixo: string | null;
        email: string | null;
        cep: string | null;
        rua: string | null;
        numero: string | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        aceitaMarketing: boolean;
        observacoesNegocios: string | null;
        createdAt: Date;
        updatedAt: Date;
        profissaoId: string | null;
        estadoCivilId: string | null;
      }>>`
        SELECT * FROM "Cliente" 
        WHERE EXTRACT(MONTH FROM "dataNascimento") = ${input.mes}
        ORDER BY EXTRACT(DAY FROM "dataNascimento")
      `;

      return clientes;
    }),

  getAuditoriaVeiculos: protectedProcedure
    .input(z.object({
      dataInicio: z.date(),
      dataFim: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Buscar veículos criados entre as datas especificadas
      const veiculos = await ctx.db.veiculo.findMany({
        where: {
          createdAt: {
            gte: input.dataInicio,
            lte: input.dataFim,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          cadastradoPor: true,
        },
      });

      return veiculos;
    }),
});