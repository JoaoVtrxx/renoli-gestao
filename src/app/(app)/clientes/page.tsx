"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { 
  Card, 
  Button, 
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui";

// Hook personalizado para debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
  
  const { data: clientes, isLoading } = api.cliente.getAll.useQuery({
    termoBusca: debouncedSearchTerm || undefined,
  });
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
      <div className="w-full max-w-7xl mx-auto p-4">
        <Card className="flex flex-col bg-white shadow-lg overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-dark">Meus Clientes</h1>
            <Link href="/clientes/novo">
              <Button variant="primary" className="text-black flex items-center gap-2">
                <span>+</span> Adicionar Cliente
              </Button>
            </Link>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <p className="mb-6 text-lg text-gray-600">
              Nenhum cliente cadastrado ainda.
            </p>
            <Link href="/clientes/novo">
              <Button variant="primary" className="text-black">
                Cadastrar Primeiro Cliente
              </Button>
            </Link>
          </main>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card className="flex flex-col bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-dark">Meus Clientes</h1>
          <Link href="/clientes/novo">
            <Button variant="primary" className="text-black flex items-center gap-2">
              <span>+</span> Adicionar Cliente
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Barra de Ferramentas */}
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="Buscar por nome, CPF ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-dark focus:border-primary-dark"
              />
            </div>
            <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Exportar Etiquetas
            </Button>
          </div>

          {/* Tabela */}
          <div className="flex-1 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-primary-dark">Nome</TableHead>
                  <TableHead className="font-semibold text-primary-dark">Telefone</TableHead>
                  <TableHead className="font-semibold text-primary-dark">E-mail</TableHead>
                  <TableHead className="font-semibold text-primary-dark">Cidade/UF</TableHead>
                  <TableHead className="font-semibold text-primary-dark text-center">Veículos Adquiridos</TableHead>
                  <TableHead className="font-semibold text-primary-dark text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes?.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="text-gray-800 font-medium">{cliente.nome}</TableCell>
                    <TableCell className="text-gray-600">{cliente.celular ?? 'Não informado'}</TableCell>
                    <TableCell className="text-gray-600">{cliente.email ?? 'Não informado'}</TableCell>
                    <TableCell className="text-gray-600">
                      {cliente.cidade && cliente.estado 
                        ? `${cliente.cidade}/${cliente.estado}` 
                        : 'Não informado'
                      }
                    </TableCell>
                    <TableCell className="text-gray-600 text-center">0</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/clientes/${cliente.id}/editar`}>
                          <button 
                            className="p-2 text-primary-dark hover:bg-gray-200 rounded-full"
                            title="Editar cliente"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(cliente.id, cliente.nome)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50"
                          title="Excluir cliente"
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
          </div>
        </main>

        {/* Footer com Paginação */}
        <footer className="flex items-center justify-center p-4 border-t border-gray-200">
          <nav className="flex items-center gap-2">
            <button 
              className="p-2 text-primary-dark hover:bg-gray-200 rounded-full disabled:opacity-50" 
              disabled
              title="Página anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-dark text-sm font-bold">1</button>
            <button className="px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-600 text-sm">2</button>
            <button className="px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-600 text-sm">3</button>
            <button 
              className="p-2 text-primary-dark hover:bg-gray-200 rounded-full"
              title="Próxima página"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </footer>
      </Card>
    </div>
  );
}
