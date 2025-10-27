"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { 
  Modal, 
  Button, 
  Input, 
  Label, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "~/components/ui";

// Tipo para a profissão
type Profissao = {
  id: string;
  nome: string;
};

export default function ProfissoesPage() {
  const [nomeProfissao, setNomeProfissao] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfissao, setEditingProfissao] = useState<Profissao | null>(null);
  const utils = api.useUtils();

  // Query para buscar todas as profissões
  const { data: profissoes, isLoading } = api.profissao.getAll.useQuery();

  // Mutation para criar nova profissão
  const createMutation = api.profissao.create.useMutation({
    onSuccess: () => {
      console.log("✅ Profissão criada com sucesso!");
      setNomeProfissao(""); // Limpar o campo
      setIsModalOpen(false); // Fechar o modal
      void utils.profissao.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao criar profissão:", error);
    },
  });

  // Mutation para atualizar profissão
  const updateMutation = api.profissao.update.useMutation({
    onSuccess: () => {
      console.log("✅ Profissão atualizada com sucesso!");
      setNomeProfissao(""); // Limpar o campo
      setIsModalOpen(false); // Fechar o modal
      setEditingProfissao(null); // Resetar modo de edição
      void utils.profissao.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao atualizar profissão:", error);
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
      if (editingProfissao) {
        // Atualizar profissão existente
        updateMutation.mutate({ 
          id: editingProfissao.id, 
          nome: nomeProfissao.trim() 
        });
      } else {
        // Criar nova profissão
        createMutation.mutate({ nome: nomeProfissao.trim() });
      }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNomeProfissao(""); // Limpar o campo ao fechar
    setEditingProfissao(null); // Resetar modo de edição
  };

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary-dark">
            Gerenciar Profissões
          </h1>
          <Button 
            variant="primary" 
            className="text-black flex items-center gap-2"
            onClick={() => {
              setEditingProfissao(null);
              setNomeProfissao("");
              setIsModalOpen(true);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Profissão
          </Button>
        </div>

        {/* Tabela de Profissões */}
        <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : !profissoes || profissoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nenhuma profissão cadastrada ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Use o botão &quot;Adicionar Profissão&quot; para criar a primeira profissão.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-3/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nome da Profissão
                  </TableHead>
                  <TableHead className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profissoes.map((profissao) => (
                  <TableRow key={profissao.id}>
                    <TableCell className="px-6 py-4 text-sm font-medium text-primary-dark">
                      {profissao.nome}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-primary-dark">
                      <div className="flex items-center gap-4">
                        <button 
                          className="text-gray-500 transition-colors hover:text-primary-dark"
                          title="Editar profissão"
                          onClick={() => {
                            setEditingProfissao(profissao);
                            setNomeProfissao(profissao.nome);
                            setIsModalOpen(true);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="text-gray-500 transition-colors hover:text-red-600"
                          title="Excluir profissão"
                          onClick={() => handleDelete(profissao.id, profissao.nome)}
                          disabled={deleteMutation.isPending}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer com total */}
        {profissoes && profissoes.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Total: {profissoes.length} profissão{profissoes.length !== 1 ? "ões" : ""}
          </div>
        )}
      </div>

      {/* Modal para Adicionar/Editar Profissão */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProfissao ? "Editar Profissão" : "Adicionar Nova Profissão"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="text-black"
              onClick={handleSubmit}
              disabled={
                (editingProfissao ? updateMutation.isPending : createMutation.isPending) || 
                !nomeProfissao.trim()
              }
            >
              {editingProfissao 
                ? (updateMutation.isPending ? 'Atualizando...' : 'Atualizar')
                : (createMutation.isPending ? 'Salvando...' : 'Salvar')
              }
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Label htmlFor="profession-name" className="mb-2 block text-sm font-medium text-gray-600">
            Nome da Profissão
          </Label>
          <Input
            id="profession-name"
            type="text"
            value={nomeProfissao}
            onChange={(e) => setNomeProfissao(e.target.value)}
            placeholder="Ex: Vendedor"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            disabled={createMutation.isPending}
          />
        </form>
      </Modal>
    </div>
  );
}