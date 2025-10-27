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

// Tipo para o estado civil
type EstadoCivil = {
  id: string;
  nome: string;
};

export default function EstadosCivisPage() {
  const [nomeEstadoCivil, setNomeEstadoCivil] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstadoCivil, setEditingEstadoCivil] = useState<EstadoCivil | null>(null);
  const utils = api.useUtils();

  // Query para buscar todos os estados civis
  const { data: estadosCivis, isLoading } = api.estadoCivil.getAll.useQuery();

  // Mutation para criar novo estado civil
  const createMutation = api.estadoCivil.create.useMutation({
    onSuccess: () => {
      console.log("✅ Estado civil criado com sucesso!");
      setNomeEstadoCivil(""); // Limpar o campo
      setIsModalOpen(false); // Fechar o modal
      void utils.estadoCivil.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao criar estado civil:", error);
    },
  });

  // Mutation para atualizar estado civil
  const updateMutation = api.estadoCivil.update.useMutation({
    onSuccess: () => {
      console.log("✅ Estado civil atualizado com sucesso!");
      setNomeEstadoCivil(""); // Limpar o campo
      setIsModalOpen(false); // Fechar o modal
      setEditingEstadoCivil(null); // Resetar modo de edição
      void utils.estadoCivil.getAll.invalidate(); // Atualizar a lista
    },
    onError: (error) => {
      console.error("❌ Erro ao atualizar estado civil:", error);
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
      if (editingEstadoCivil) {
        // Atualizar estado civil existente
        updateMutation.mutate({ 
          id: editingEstadoCivil.id, 
          nome: nomeEstadoCivil.trim() 
        });
      } else {
        // Criar novo estado civil
        createMutation.mutate({ nome: nomeEstadoCivil.trim() });
      }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNomeEstadoCivil(""); // Limpar o campo ao fechar
    setEditingEstadoCivil(null); // Resetar modo de edição
  };

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary-dark">
            Gerenciar Estados Civis
          </h1>
          <Button 
            variant="primary" 
            className="text-black flex items-center gap-2"
            onClick={() => {
              setEditingEstadoCivil(null);
              setNomeEstadoCivil("");
              setIsModalOpen(true);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Estado Civil
          </Button>
        </div>

        {/* Tabela de Estados Civis */}
        <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : !estadosCivis || estadosCivis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nenhum estado civil cadastrado ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Use o botão &quot;Adicionar Estado Civil&quot; para criar o primeiro estado civil.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-3/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nome do Estado Civil
                  </TableHead>
                  <TableHead className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estadosCivis.map((estadoCivil) => (
                  <TableRow key={estadoCivil.id}>
                    <TableCell className="px-6 py-4 text-sm font-medium text-primary-dark">
                      {estadoCivil.nome}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-primary-dark">
                      <div className="flex items-center gap-4">
                        <button 
                          className="text-gray-500 transition-colors hover:text-primary-dark"
                          title="Editar estado civil"
                          onClick={() => {
                            setEditingEstadoCivil(estadoCivil);
                            setNomeEstadoCivil(estadoCivil.nome);
                            setIsModalOpen(true);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="text-gray-500 transition-colors hover:text-red-600"
                          title="Excluir estado civil"
                          onClick={() => handleDelete(estadoCivil.id, estadoCivil.nome)}
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
        {estadosCivis && estadosCivis.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Total: {estadosCivis.length} estado{estadosCivis.length !== 1 ? "s civis" : " civil"}
          </div>
        )}
      </div>

      {/* Modal para Adicionar/Editar Estado Civil */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEstadoCivil ? "Editar Estado Civil" : "Adicionar Novo Estado Civil"}
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
                (editingEstadoCivil ? updateMutation.isPending : createMutation.isPending) || 
                !nomeEstadoCivil.trim()
              }
            >
              {editingEstadoCivil 
                ? (updateMutation.isPending ? 'Atualizando...' : 'Atualizar')
                : (createMutation.isPending ? 'Salvando...' : 'Salvar')
              }
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Label htmlFor="civil-status-name" className="mb-2 block text-sm font-medium text-gray-600">
            Nome do Estado Civil
          </Label>
          <Input
            id="civil-status-name"
            type="text"
            value={nomeEstadoCivil}
            onChange={(e) => setNomeEstadoCivil(e.target.value)}
            placeholder="Ex: Solteiro(a), Casado(a), Divorciado(a)..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            disabled={createMutation.isPending}
          />
        </form>
      </Modal>
    </div>
  );
}