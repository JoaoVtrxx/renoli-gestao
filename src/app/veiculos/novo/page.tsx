"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { StatusVeiculo, TipoTransacao } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const createVeiculoSchema = z.object({
  placa: z.string().min(7, "A placa deve ter no mínimo 7 caracteres"),
  marca: z.string().min(2, "A marca é obrigatória"),
  modelo: z.string().min(1, "O modelo é obrigatório"),
  anoFabricacao: z.coerce.number().int().min(1900),
  anoModelo: z.coerce.number().int().min(1900),
  cor: z.string().min(3, "A cor é obrigatória"),
  km: z.coerce.number().int().min(0),
  precoVenda: z.coerce.number(),
  cambio: z.string().min(3, "O câmbio é obrigatório"),
  combustivel: z.string().min(3, "O combustível é obrigatório"),
  portas: z.coerce.number().int(),
  status: z.nativeEnum(StatusVeiculo),
  tipoTransacao: z.nativeEnum(TipoTransacao),
  clienteIdVendedor: z.string({ required_error: "Selecione o cliente vendedor."}),
  descricaoAnuncio: z.string().optional(),
  observacoesInternas: z.string().optional(),
});

type CreateVeiculoInput = z.infer<typeof createVeiculoSchema>;

export default function CadastrarVeiculoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm<CreateVeiculoInput>({
    resolver: zodResolver(createVeiculoSchema),
    defaultValues: {
      status: StatusVeiculo.DISPONIVEL,
      tipoTransacao: TipoTransacao.COMPRA,
    },
  });

  const { mutate, isPending } = api.veiculo.create.useMutation({
    onSuccess: () => {
      console.log("✅ Veículo salvo com sucesso!");
      form.reset();
    },
    onError: (error) => {
      console.error("❌ Erro ao salvar veículo:", error);
    },
  });

  function onSubmit(data: CreateVeiculoInput) {
    mutate(data);
  }

  const { data: clientes, isLoading: isLoadingClientes } = api.cliente.getAll.useQuery();

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
          <h1 className="text-3xl font-bold text-gray-800">Cadastrar Novo Veículo</h1>
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
                <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                  Placa *
                </label>
                <input
                  id="placa"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC-1234"
                  {...form.register("placa")}
                />
                {form.formState.errors.placa && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.placa.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <input
                  id="marca"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Volkswagen"
                  {...form.register("marca")}
                />
                {form.formState.errors.marca && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.marca.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo *
                </label>
                <input
                  id="modelo"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Polo"
                  {...form.register("modelo")}
                />
                {form.formState.errors.modelo && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.modelo.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor *
                </label>
                <input
                  id="cor"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Branco"
                  {...form.register("cor")}
                />
                {form.formState.errors.cor && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.cor.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Especificações Técnicas */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="anoFabricacao" className="block text-sm font-medium text-gray-700 mb-1">
                  Ano Fabricação *
                </label>
                <input
                  id="anoFabricacao"
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("anoFabricacao")}
                />
                {form.formState.errors.anoFabricacao && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.anoFabricacao.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="anoModelo" className="block text-sm font-medium text-gray-700 mb-1">
                  Ano Modelo *
                </label>
                <input
                  id="anoModelo"
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("anoModelo")}
                />
                {form.formState.errors.anoModelo && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.anoModelo.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="km" className="block text-sm font-medium text-gray-700 mb-1">
                  Quilometragem *
                </label>
                <input
                  id="km"
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("km")}
                />
                {form.formState.errors.km && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.km.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cambio" className="block text-sm font-medium text-gray-700 mb-1">
                  Câmbio *
                </label>
                <select
                  id="cambio"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("cambio")}
                >
                  <option value="">Selecione</option>
                  <option value="manual">Manual</option>
                  <option value="automatico">Automático</option>
                  <option value="cvt">CVT</option>
                </select>
                {form.formState.errors.cambio && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.cambio.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="combustivel" className="block text-sm font-medium text-gray-700 mb-1">
                  Combustível *
                </label>
                <select
                  id="combustivel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("combustivel")}
                >
                  <option value="">Selecione</option>
                  <option value="gasolina">Gasolina</option>
                  <option value="etanol">Etanol</option>
                  <option value="flex">Flex</option>
                  <option value="diesel">Diesel</option>
                  <option value="eletrico">Elétrico</option>
                  <option value="hibrido">Híbrido</option>
                </select>
                {form.formState.errors.combustivel && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.combustivel.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="portas" className="block text-sm font-medium text-gray-700 mb-1">
                  Portas *
                </label>
                <input
                  id="portas"
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("portas")}
                />
                {form.formState.errors.portas && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.portas.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informações Comerciais */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Comerciais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clienteIdVendedor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente Vendedor *
                </label>
                <select
                  id="clienteIdVendedor"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("clienteIdVendedor")}
                >
                  <option value="">Selecione um cliente</option>
                  {isLoadingClientes ? (
                    <option>Carregando...</option>
                  ) : (
                    clientes?.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))
                  )}
                </select>
                {form.formState.errors.clienteIdVendedor && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.clienteIdVendedor.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="precoVenda" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço de Venda *
                </label>
                <input
                  id="precoVenda"
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("precoVenda")}
                />
                {form.formState.errors.precoVenda && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.precoVenda.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("status")}
                >
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="RESERVADO">Reservado</option>
                  <option value="VENDIDO">Vendido</option>
                </select>
              </div>

              <div>
                <label htmlFor="tipoTransacao" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo Transação
                </label>
                <select
                  id="tipoTransacao"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("tipoTransacao")}
                >
                  <option value="COMPRA">Compra</option>
                  <option value="CONSIGNACAO">Consignação</option>
                  <option value="LOJA">Loja</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descrições */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Descrições</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="descricaoAnuncio" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição para Anúncio
                </label>
                <textarea
                  id="descricaoAnuncio"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição que aparecerá no anúncio..."
                  {...form.register("descricaoAnuncio")}
                />
              </div>

              <div>
                <label htmlFor="observacoesInternas" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações Internas
                </label>
                <textarea
                  id="observacoesInternas"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observações internas (não aparecerão no anúncio)..."
                  {...form.register("observacoesInternas")}
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
                "Salvar Veículo"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}