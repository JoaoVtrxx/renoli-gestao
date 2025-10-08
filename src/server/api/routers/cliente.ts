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
  estadoCivilId: z.string().optional(),
});

export const clienteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.cliente.findMany({
      orderBy: { nome: "asc" },
    });
  }),

  create: protectedProcedure
    .input(createClienteSchema)
    .mutation(async ({ ctx, input }) => {
      // Tratamento especial para email vazio
      const emailToSave = input.email === "" ? undefined : input.email;
      // Tratamento especial para profissaoId vazio/null
      const profissaoIdToSave = input.profissaoId ?? undefined;

      return ctx.db.cliente.create({
        data: {
          ...input,
          email: emailToSave,
          profissaoId: profissaoIdToSave,
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

      return ctx.db.cliente.update({
        where: {
          id,
        },
        data: {
          ...updateData,
          email: emailToSave,
          profissaoId: profissaoIdToSave,
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
});