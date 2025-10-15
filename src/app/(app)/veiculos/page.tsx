"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function VeiculosPage() {
  const { data: veiculos, isLoading } = api.veiculo.getAll.useQuery();
  const utils = api.useUtils();

  const deleteMutation = api.veiculo.delete.useMutation({
    onSuccess: () => {
      console.log("✅ Veículo excluído com sucesso!");
      void utils.veiculo.getAll.invalidate();
    },
    onError: (error) => {
      console.error("❌ Erro ao excluir veículo:", error);
    },
  });

  const handleDelete = (veiculoId: string, veiculoInfo: string) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o veículo ${veiculoInfo}?`
    );
    
    if (confirmDelete) {
      deleteMutation.mutate({ id: veiculoId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Carregando veículos...</p>
      </div>
    );
  }

  if (!veiculos || veiculos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Estoque de Veículos
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Nenhum veículo cadastrado ainda.
          </p>
          <Link
            href="/veiculos/novo"
            className="rounded-lg bg-yellow-500 px-6 py-3 text-white font-semibold transition-colors hover:bg-yellow-600"
          >
            Cadastrar Primeiro Veículo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Estoque de Veículos</h1>
        <Link
          href="/veiculos/novo"
          className="rounded-lg bg-yellow-500 px-6 py-3 text-white font-semibold transition-colors hover:bg-yellow-600"
        >
          Cadastrar Novo Veículo
        </Link>
      </div>

      {/* Tabela de Veículos */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Veículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Placa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Preço de Venda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Vendedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {veiculos.map((veiculo) => (
              <tr key={veiculo.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {veiculo.marca} {veiculo.modelo}
                  {veiculo.versao && (
                    <span className="text-gray-500"> - {veiculo.versao}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {veiculo.placa}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(veiculo.precoVenda))}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {veiculo.vendedor.nome}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      veiculo.status === "DISPONIVEL"
                        ? "bg-green-100 text-green-800"
                        : veiculo.status === "VENDIDO"
                        ? "bg-red-100 text-red-800"
                        : veiculo.status === "RESERVADO"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {veiculo.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Link
                      href={`/veiculos/${veiculo.id}/editar`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => 
                        handleDelete(
                          veiculo.id, 
                          `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})`
                        )
                      }
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-900 disabled:text-red-400"
                    >
                      {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer da tabela */}
      <div className="mt-4 text-sm text-gray-500">
        Total: {veiculos.length} veículo{veiculos.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
