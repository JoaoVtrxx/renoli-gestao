"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { StatusVeiculo } from "@prisma/client";
import { api } from "~/trpc/react";
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
} from "~/components/ui";

// Função auxiliar para mapear status para variantes do Badge
const getStatusVariant = (status: string): "success" | "warning" | "secondary" => {
  switch (status) {
    case "DISPONIVEL":
      return "success";
    case "RESERVADO":
      return "warning";
    case "VENDIDO":
      return "secondary";
    default:
      return "secondary";
  }
};

// Função auxiliar para mapear tipo de transação para variantes do Badge
const getTransacaoVariant = (tipoTransacao: string): "info" | "accent" => {
  switch (tipoTransacao) {
    case "COMPRA":
      return "info";
    case "CONSIGNACAO":
      return "accent";
    default:
      return "info";
  }
};

export default function VeiculosPage() {
  // Estados para busca e filtro
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusVeiculo | null>(null);
  const [debounceTermoBusca, setDebounceTermoBusca] = useState('');

  // Debounce do termo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceTermoBusca(termoBusca);
    }, 500);

    return () => clearTimeout(timer);
  }, [termoBusca]);

  // Chamada da API com filtros
  const { data: veiculos, isLoading } = api.veiculo.getAll.useQuery({
    termoBusca: debounceTermoBusca || undefined,
    filtroStatus: filtroStatus ?? undefined,
  });
  
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
    // Verificar se há filtros ativos
    const hasActiveFilters = debounceTermoBusca.length > 0 || filtroStatus !== null;

    return (
      <div className="p-6">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Estoque de Veículos
          </h1>
          
          {hasActiveFilters ? (
            <>
              <p className="mb-6 text-lg text-gray-600">
                Nenhum veículo encontrado para os filtros aplicados.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setTermoBusca('');
                    setFiltroStatus(null);
                  }}
                  className="text-center"
                >
                  Limpar Filtros
                </Button>
                <Link href="/veiculos/novo">
                  <Button variant="primary" className="text-center">
                    Adicionar Veículo
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mb-6 text-lg text-gray-600">
                Nenhum veículo cadastrado ainda.
              </p>
              <Link href="/veiculos/novo">
                <Button variant="primary" className="text-center">
                  Cadastrar Primeiro Veículo
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Meu Estoque de Veículos</h1>
        <Link href="/veiculos/novo">
          <Button variant="primary" className="text-center">
            + Adicionar Veículo
          </Button>
        </Link>
      </div>

      {/* Card principal contendo busca, filtros e tabela */}
      <Card>
        {/* Barra de busca e filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por modelo, marca ou placa..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Filtros de status */}
          <div className="flex gap-2">
            <button 
              onClick={() => setFiltroStatus(null)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                filtroStatus === null 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltroStatus('DISPONIVEL')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                filtroStatus === 'DISPONIVEL' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Disponível
            </button>
            <button 
              onClick={() => setFiltroStatus('RESERVADO')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                filtroStatus === 'RESERVADO' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reservado
            </button>
            <button 
              onClick={() => setFiltroStatus('VENDIDO')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                filtroStatus === 'VENDIDO' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Vendido
            </button>
          </div>
        </div>

        {/* Tabela de Veículos */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FOTO</TableHead>
                <TableHead>VEÍCULO</TableHead>
                <TableHead>ANO/MODELO</TableHead>
                <TableHead>PLACA</TableHead>
                <TableHead>PREÇO DE VENDA</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>TRANSAÇÃO</TableHead>
                <TableHead>AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.map((veiculo) => (
                <TableRow key={veiculo.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {veiculo.marca} {veiculo.modelo}
                    </div>
                    {veiculo.versao && (
                      <div className="text-sm text-gray-500">{veiculo.versao}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {veiculo.anoFabricacao}/{veiculo.anoModelo}
                  </TableCell>
                  <TableCell>{veiculo.placa}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(veiculo.precoVenda))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(veiculo.status)}>
                      {veiculo.status === "DISPONIVEL" ? "Disponível" : 
                       veiculo.status === "RESERVADO" ? "Reservado" : "Vendido"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTransacaoVariant(veiculo.tipoTransacao)}>
                      {veiculo.tipoTransacao === "COMPRA" ? "Compra" : "Consignação"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Botão Ver */}
                      <Link href={`/veiculos/${veiculo.id}`}>
                        <button 
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="Ver detalhes"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </Link>
                      
                      {/* Botão Editar */}
                      <Link href={`/veiculos/${veiculo.id}/editar`}>
                        <button 
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="Editar veículo"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </Link>
                      
                      {/* Botão Excluir */}
                      <button
                        onClick={() => 
                          handleDelete(
                            veiculo.id, 
                            `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})`
                          )
                        }
                        disabled={deleteMutation.isPending}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 disabled:text-gray-300"
                        title="Excluir veículo"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Footer da tabela */}
        <div className="mt-4 text-sm text-gray-500">
          Total: {veiculos.length} veículo{veiculos.length !== 1 ? "s" : ""}
        </div>
      </Card>
    </div>
  );
}
