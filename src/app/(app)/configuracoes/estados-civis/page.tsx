"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function EstadosCivisPage() {
  const [nomeEstadoCivil, setNomeEstadoCivil] = useState("");
  const utils = api.useUtils();

  // Query para buscar todos os estados civis
  const { data: estadosCivis, isLoading } = api.estadoCivil.getAll.useQuery();

  // Mutation para criar novo estado civil
  const createMutation = api.estadoCivil.create.useMutation({
    onSuccess: () => {
      console.log("✅ Estado civil criado com sucesso!");
      setNomeEstadoCivil(""); // Limpar o campo
      void utils.estadoCivil.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao criar estado civil:", error);
    },
  });

  // Mutation para excluir estado civil
  const deleteMutation = api.estadoCivil.delete.useMutation({
    onSuccess: () => {
      console.log("✅ Estado civil excluído com sucesso!");
      void utils.estadoCivil.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao excluir estado civil:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomeEstadoCivil.trim()) {
      createMutation.mutate({ nome: nomeEstadoCivil.trim() });
    }
  };

  const handleDelete = (id: string, nome: string) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o estado civil "${nome}"?`
    );
    
    if (confirmDelete) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gerenciar Estados Civis
          </h1>
          <p className="text-gray-600">
            Adicione e gerencie os estados civis disponíveis para cadastro de clientes.
          </p>
        </div>

        {/* Formulário para adicionar novo estado civil */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label 
                htmlFor="nomeEstadoCivil" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome do Estado Civil
              </label>
              <input
                id="nomeEstadoCivil"
                type="text"
                value={nomeEstadoCivil}
                onChange={(e) => setNomeEstadoCivil(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Solteiro(a), Casado(a), Divorciado(a)..."
                disabled={createMutation.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || !nomeEstadoCivil.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adicionando...
                </>
              ) : (
                "Adicionar"
              )}
            </button>
          </form>
        </div>

        {/* Lista de estados civis */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Estados Civis Cadastrados
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : !estadosCivis || estadosCivis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nenhum estado civil cadastrado ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Use o formulário acima para adicionar o primeiro estado civil.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {estadosCivis.map((estadoCivil) => (
                <div
                  key={estadoCivil.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{estadoCivil.nome}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(estadoCivil.id, estadoCivil.nome)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-900 disabled:text-red-400 font-medium px-3 py-1 rounded transition-colors"
                  >
                    {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer com total */}
          {estadosCivis && estadosCivis.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Total: {estadosCivis.length} estado{estadosCivis.length !== 1 ? "s civis" : " civil"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}