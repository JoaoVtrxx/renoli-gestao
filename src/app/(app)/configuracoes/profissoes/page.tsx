"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function ProfissoesPage() {
  const [nomeProfissao, setNomeProfissao] = useState("");
  const utils = api.useUtils();

  // Query para buscar todas as profissões
  const { data: profissoes, isLoading } = api.profissao.getAll.useQuery();

  // Mutation para criar nova profissão
  const createMutation = api.profissao.create.useMutation({
    onSuccess: () => {
      console.log("✅ Profissão criada com sucesso!");
      setNomeProfissao(""); // Limpar o campo
      void utils.profissao.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao criar profissão:", error);
    },
  });

  // Mutation para excluir profissão
  const deleteMutation = api.profissao.delete.useMutation({
    onSuccess: () => {
      console.log("✅ Profissão excluída com sucesso!");
      void utils.profissao.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao excluir profissão:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomeProfissao.trim()) {
      createMutation.mutate({ nome: nomeProfissao.trim() });
    }
  };

  const handleDelete = (id: string, nome: string) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a profissão "${nome}"?`
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
            Gerenciar Profissões
          </h1>
          <p className="text-gray-600">
            Adicione e gerencie as profissões disponíveis para cadastro de clientes.
          </p>
        </div>

        {/* Formulário para adicionar nova profissão */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label 
                htmlFor="nomeProfissao" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome da Profissão
              </label>
              <input
                id="nomeProfissao"
                type="text"
                value={nomeProfissao}
                onChange={(e) => setNomeProfissao(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Engenheiro, Advogado, Médico..."
                disabled={createMutation.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || !nomeProfissao.trim()}
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

        {/* Lista de profissões */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Profissões Cadastradas
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : !profissoes || profissoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nenhuma profissão cadastrada ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Use o formulário acima para adicionar a primeira profissão.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {profissoes.map((profissao) => (
                <div
                  key={profissao.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{profissao.nome}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(profissao.id, profissao.nome)}
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
          {profissoes && profissoes.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Total: {profissoes.length} profissão{profissoes.length !== 1 ? "ões" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}