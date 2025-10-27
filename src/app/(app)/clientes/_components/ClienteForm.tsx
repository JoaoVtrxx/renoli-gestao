"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Label, Input, Select, Textarea, Button } from "~/components/ui";

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Dados Pessoais */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary-dark border-b border-gray-200 pb-2">
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="nome">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite o nome completo"
                  {...form.register("nome")}
                />
                {form.formState.errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.nome.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="cpf">CPF/CNPJ</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="Digite o CPF ou CNPJ"
                    {...form.register("cpf")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    type="text"
                    placeholder="Digite o RG"
                    {...form.register("rg")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    {...form.register("dataNascimento")}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="profissaoId">Profissão</Label>
                  <Select
                    id="profissaoId"
                    disabled={isLoadingProfissoes}
                    {...form.register("profissaoId")}
                  >
                    <option value="">
                      {isLoadingProfissoes ? "Carregando profissões..." : "Selecione a profissão"}
                    </option>
                    {profissoes?.map((profissao) => (
                      <option key={profissao.id} value={profissao.id}>
                        {profissao.nome}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="estadoCivilId">Estado Civil</Label>
                  <Select
                    id="estadoCivilId"
                    disabled={isLoadingEstadosCivis}
                    {...form.register("estadoCivilId")}
                  >
                    <option value="">
                      {isLoadingEstadosCivis ? "Carregando estados civis..." : "Selecione o estado civil"}
                    </option>
                    {estadosCivis?.map((estadoCivil) => (
                      <option key={estadoCivil.id} value={estadoCivil.id}>
                        {estadoCivil.nome}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary-dark border-b border-gray-200 pb-2">
              Informações de Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="celular">
                  Telefone Celular <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="celular"
                  type="tel"
                  mask="(99) 99999-9999"
                  placeholder="(00) 00000-0000"
                  {...form.register("celular")}
                />
                {form.formState.errors.celular && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.celular.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="telefoneFixo">Telefone Fixo</Label>
                <Input
                  id="telefoneFixo"
                  type="tel"
                  mask="(99) 9999-9999"
                  placeholder="(00) 0000-0000"
                  {...form.register("telefoneFixo")}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite o e-mail"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary-dark border-b border-gray-200 pb-2">
              Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  type="text"
                  mask="99999-999"
                  placeholder="00000-000"
                  {...form.register("cep")}
                />
              </div>
              
              <div className="md:col-span-3">
                <Label htmlFor="rua">Rua/Logradouro</Label>
                <Input
                  id="rua"
                  type="text"
                  placeholder="Digite a rua ou logradouro"
                  {...form.register("rua")}
                />
              </div>
              
              <div className="md:col-span-1">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  type="text"
                  placeholder="Nº"
                  {...form.register("numero")}
                />
              </div>
              
              <div className="md:col-span-3">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  type="text"
                  placeholder="Apto, bloco, etc."
                  {...form.register("complemento")}
                />
              </div>
              
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  type="text"
                  placeholder="Digite o bairro"
                  {...form.register("bairro")}
                />
              </div>
              
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  type="text"
                  placeholder="Digite a cidade"
                  {...form.register("cidade")}
                />
              </div>
              
              <div>
                <Label htmlFor="estado">Estado (UF)</Label>
                <Select
                  id="estado"
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
                </Select>
              </div>
            </div>
          </div>

          {/* Preferências e Marketing */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary-dark border-b border-gray-200 pb-2">
              Preferências e Marketing
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="aceitaMarketing"
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded bg-white border-gray-300 text-primary focus:ring-primary"
                  {...form.register("aceitaMarketing")}
                />
                <Label htmlFor="aceitaMarketing" className="ml-2 text-sm">
                  Aceita receber comunicação e marketing?
                </Label>
              </div>
              
              <div>
                <Label htmlFor="observacoesNegocios">Anotações de Negócios</Label>
                <Textarea
                  id="observacoesNegocios"
                  rows={4}
                  placeholder="Digite suas anotações aqui..."
                  {...form.register("observacoesNegocios")}
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-black"
              disabled={isPending}
            >
              {isPending ? 'Salvando...' : (initialData ? 'Atualizar Cliente' : 'Salvar Cliente')}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}