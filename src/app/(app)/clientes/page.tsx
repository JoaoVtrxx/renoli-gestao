"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function ClientesPage() {
  const { data: clientes, isLoading } = api.cliente.getAll.useQuery();
  const utils = api.useUtils();

  const deleteMutation = api.cliente.delete.useMutation({
    onSuccess: () => {
      console.log("✅ Cliente excluído com sucesso!");
      void utils.cliente.getAll.invalidate();
    },
    onError: (error) => {
      console.error("❌ Erro ao excluir cliente:", error);
    },
  });

  const handleDelete = (clienteId: string, clienteNome: string) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o cliente ${clienteNome}?`
    );
    
    if (confirmDelete) {
      deleteMutation.mutate({ id: clienteId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Carregando clientes...</p>
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Meus Clientes
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Nenhum cliente cadastrado ainda.
          </p>
          <Link
            href="/clientes/novo"
            className="rounded-lg bg-yellow-500 px-6 py-3 text-white font-semibold transition-colors hover:bg-yellow-600"
          >
            Cadastrar Primeiro Cliente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Meus Clientes</h1>
        <Link
          href="/clientes/novo"
          className="rounded-lg bg-yellow-500 px-6 py-3 text-white font-semibold transition-colors hover:bg-yellow-600"
        >
          Cadastrar Novo Cliente
        </Link>
      </div>

      {/* Tabela de Clientes */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                E-mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {cliente.nome}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {cliente.celular}
                  {cliente.telefoneFixo && (
                    <div className="text-xs text-gray-500">
                      Fixo: {cliente.telefoneFixo}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {cliente.email ?? (
                    <span className="text-gray-400 italic">Não informado</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {cliente.cidade ?? (
                    <span className="text-gray-400 italic">Não informado</span>
                  )}
                  {cliente.estado && (
                    <div className="text-xs text-gray-500">
                      {cliente.estado}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Link
                      href={`/clientes/${cliente.id}/editar`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(cliente.id, cliente.nome)}
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
        Total: {clientes.length} cliente{clientes.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
