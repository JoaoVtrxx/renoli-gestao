"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { 
  Button, 
  Card, 
  Badge, 
  Label, 
  Input, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "~/components/ui";

export default function AuditoriaVeiculosPage() {
  const [dataInicio, setDataInicio] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]!
  );
  const [dataFim, setDataFim] = useState<string>(
    new Date().toISOString().split('T')[0]!
  );
  const [showResults, setShowResults] = useState(false);

  const { data: veiculos, isLoading, refetch } = api.relatorio.getAuditoriaVeiculos.useQuery(
    { 
      dataInicio: new Date(dataInicio),
      dataFim: new Date(new Date(dataFim).getTime() + 24 * 60 * 60 * 1000 - 1) // Fim do dia
    },
    { enabled: false } // Não buscar automaticamente
  );

  const handleGerarRelatorio = () => {
    setShowResults(true);
    void refetch();
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'success';
      case 'RESERVADO':
        return 'warning';
      case 'VENDIDO':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'Disponível';
      case 'RESERVADO':
        return 'Reservado';
      case 'VENDIDO':
        return 'Vendido';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header com Breadcrumb */}
        <div>
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2" role="list">
              <li>
                <div>
                  <a className="text-sm font-medium text-gray-500 hover:text-primary-dark" href="#">
                    Central de Relatórios
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <a aria-current="page" className="ml-2 text-sm font-medium text-primary-dark" href="#">
                    Auditoria de Veículos
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark">
            Relatório de Auditoria de Veículos
          </h2>
        </div>

        {/* Card de Filtros */}
        <Card className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 items-end">
            <div className="space-y-1">
              <Label htmlFor="date-from" className="text-sm font-medium text-gray-600">
                De:
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date-to" className="text-sm font-medium text-gray-600">
                Até:
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:col-start-3">
              <Button
                variant="primary"
                className="text-black w-full justify-center flex items-center gap-2"
                onClick={handleGerarRelatorio}
                disabled={!dataInicio || !dataFim}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4M8 3v4M4 11h16" />
                </svg>
                Gerar Relatório
              </Button>
            </div>
          </div>
        </Card>

        {/* Estado Inicial */}
        {!showResults && (
          <div className="text-center py-16" id="initial-state">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-dark/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Gerar Relatório de Auditoria</h3>
            <p className="mt-1 text-sm text-gray-500">
              Por favor, selecione um intervalo de datas para gerar o relatório de auditoria.
            </p>
          </div>
        )}

        {/* Seção de Resultados */}
        {showResults && (
          <div className="space-y-6" id="results-state">
            <h3 className="text-xl font-semibold text-primary-dark">
              Veículos Inseridos de{' '}
              <span id="report-date-range">
                {new Date(dataInicio).toLocaleDateString('pt-BR')} a{' '}
                {new Date(dataFim).toLocaleDateString('pt-BR')}
              </span>
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <p className="text-gray-600">Carregando...</p>
              </div>
            ) : !veiculos || veiculos.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum veículo encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há veículos cadastrados no período selecionado.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Data de Cadastro
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Veículo
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Usuário
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {veiculos.map((veiculo) => (
                      <TableRow key={veiculo.id}>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(veiculo.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
                          {veiculo.marca} {veiculo.modelo}, {veiculo.anoFabricacao}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant={getBadgeVariant(veiculo.status)}>
                            {getStatusText(veiculo.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {veiculo.cadastradoPor.name ?? 'Usuário não informado'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Footer com total */}
            {veiculos && veiculos.length > 0 && (
              <div className="text-sm text-gray-500 text-center">
                Total: {veiculos.length} veículo{veiculos.length !== 1 ? 's' : ''} encontrado{veiculos.length !== 1 ? 's' : ''} no período.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}