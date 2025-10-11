"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const createClienteSchema = z.object({
  // Informações Básicas
  nome: z.string().min(2, "O nome é obrigatório"),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  dataNascimento: z.string().optional(), // Input date retorna string

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
  estadoCivilId: z.string().optional().nullable().transform(val => val === "" ? null : val),
});

type CreateClienteInput = z.infer<typeof createClienteSchema>;

interface ClienteFormProps {
  initialData?: Partial<CreateClienteInput & { id: string }>;
}

export default function ClienteForm({ initialData }: ClienteFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createClienteSchema),
    defaultValues: {
      aceitaMarketing: true,
      ...initialData,
    },
  });

  const { mutate: createCliente, isPending: isCreating } = api.cliente.create.useMutation({
    onSuccess: () => {
      console.log("✅ Cliente criado com sucesso!");
      form.reset();
      router.push("/clientes");
    },
    onError: (error) => {
      console.error("❌ Erro ao criar cliente:", error);
    },
  });

  const { mutate: updateCliente, isPending: isUpdating } = api.cliente.update.useMutation({
    onSuccess: () => {
      console.log("✅ Cliente atualizado com sucesso!");
      router.push("/clientes");
    },
    onError: (error) => {
      console.error("❌ Erro ao atualizar cliente:", error);
    },
  });

  const isPending = isCreating || isUpdating;

  // Hook para buscar profissões
  const { data: profissoes, isLoading: isLoadingProfissoes } = api.profissao.getAll.useQuery();

  // Hook para buscar estados civis
  const { data: estadosCivis, isLoading: isLoadingEstadosCivis } = api.estadoCivil.getAll.useQuery();

  function onSubmit(data: CreateClienteInput) {
    // Converter data de nascimento para Date se fornecida
    const submissionData = {
      ...data,
      dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined,
    };
    
    if (initialData?.id) {
      // Modo de edição - usar update mutation
      updateCliente({
        id: initialData.id,
        ...submissionData,
      });
    } else {
      // Modo de criação - usar create mutation
      createCliente(submissionData);
    }
  }

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {initialData ? "Editar Cliente" : "Cadastrar Novo Cliente"}
          </h1>
          <div className="text-sm text-gray-600">
            Usuário: <span className="font-semibold text-blue-600">{session.user?.name}</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  id="nome"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="João Silva"
                  {...form.register("nome")}
                />
                {form.formState.errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.nome.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                  {...form.register("cpf")}
                />
              </div>

              <div>
                <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-1">
                  RG
                </label>
                <input
                  id="rg"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00.000.000-0"
                  {...form.register("rg")}
                />
              </div>

              <div>
                <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  id="dataNascimento"
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("dataNascimento")}
                />
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações de Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
                  Celular *
                </label>
                <input
                  id="celular"
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  {...form.register("celular")}
                />
                {form.formState.errors.celular && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.celular.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefoneFixo" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone Fixo
                </label>
                <input
                  id="telefoneFixo"
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 3333-3333"
                  {...form.register("telefoneFixo")}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="joao@email.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  id="cep"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00000-000"
                  {...form.register("cep")}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                  Rua/Logradouro
                </label>
                <input
                  id="rua"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rua das Flores"
                  {...form.register("rua")}
                />
              </div>

              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  id="numero"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123"
                  {...form.register("numero")}
                />
              </div>

              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  id="complemento"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apto 45"
                  {...form.register("complemento")}
                />
              </div>

              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  id="bairro"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Centro"
                  {...form.register("bairro")}
                />
              </div>

              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  id="cidade"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="São Paulo"
                  {...form.register("cidade")}
                />
              </div>

              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="estado"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("estado")}
                >
                  <option value="">Selecione</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Marketing e Observações */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Adicionais</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="profissaoId" className="block text-sm font-medium text-gray-700 mb-1">
                  Profissão
                </label>
                <select
                  id="profissaoId"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoadingProfissoes}
                  {...form.register("profissaoId")}
                >
                  <option value="">
                    {isLoadingProfissoes ? "Carregando profissões..." : "Selecione uma profissão"}
                  </option>
                  {profissoes?.map((profissao) => (
                    <option key={profissao.id} value={profissao.id}>
                      {profissao.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estadoCivilId" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil
                </label>
                <select
                  id="estadoCivilId"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoadingEstadosCivis}
                  {...form.register("estadoCivilId")}
                >
                  <option value="">
                    {isLoadingEstadosCivis ? "Carregando estados civis..." : "Selecione um estado civil"}
                  </option>
                  {estadosCivis?.map((estadoCivil) => (
                    <option key={estadoCivil.id} value={estadoCivil.id}>
                      {estadoCivil.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="aceitaMarketing"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...form.register("aceitaMarketing")}
                />
                <label htmlFor="aceitaMarketing" className="ml-2 block text-sm text-gray-700">
                  Aceita receber materiais de marketing
                </label>
              </div>

              <div>
                <label htmlFor="observacoesNegocios" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações de Negócios
                </label>
                <textarea
                  id="observacoesNegocios"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observações importantes sobre o cliente..."
                  {...form.register("observacoesNegocios")}
                />
              </div>
            </div>
          </div>

          {/* Botão de Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                initialData ? "Atualizar Cliente" : "Salvar Cliente"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}