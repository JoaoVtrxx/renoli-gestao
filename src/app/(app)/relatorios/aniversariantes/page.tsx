"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { 
  Button, 
  Card, 
  Label, 
  Select, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "~/components/ui";

export default function AniversariantesPage() {
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  const [showResults, setShowResults] = useState(false);

  const { data: aniversariantes, isLoading, refetch } = api.relatorio.getAniversariantesDoMes.useQuery(
    { mes: mesSelecionado },
    { enabled: false } // Não buscar automaticamente
  );

  const meses = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
  ];

  const handleBuscarAniversariantes = () => {
    setShowResults(true);
    void refetch();
  };

  const formatarDia = (dataNascimento: Date | null) => {
    if (!dataNascimento) return "-";
    return String(dataNascimento.getDate()).padStart(2, "0");
  };

  const formatarTelefone = (celular: string, telefoneFixo: string | null) => {
    if (celular) return celular;
    if (telefoneFixo) return telefoneFixo;
    return "-";
  };

  const getNomeMes = (numeroMes: number) => {
    const mes = meses.find(m => m.valor === numeroMes);
    return mes?.nome ?? "Mês";
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
                    Aniversariantes do Mês
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark">
            Aniversariantes do Mês
          </h1>
        </div>

        {/* Card de Filtros */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Label htmlFor="month-select" className="font-semibold whitespace-nowrap text-gray-600">
              Selecione o Mês:
            </Label>
            <Select
              id="month-select"
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(Number(e.target.value))}
              className="w-full sm:w-auto flex-grow"
            >
              {meses.map((mes) => (
                <option key={mes.valor} value={mes.valor}>
                  {mes.nome}
                </option>
              ))}
            </Select>
            <Button
              variant="primary"
              className="text-black w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={handleBuscarAniversariantes}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Aniversariantes
            </Button>
          </div>
        </Card>

        {/* Container de Resultados */}
        <div id="results-container">
          {/* Estado Inicial */}
          {!showResults && (
            <div className="text-center py-16" id="initial-state">
              <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    clipRule="evenodd" 
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm3.707 4.707a1 1 0 00-1.414-1.414L7 6.586V10a1 1 0 102 0V6.586l1.293 1.293a1 1 0 001.414-1.414L9.414 4.586l-1.707.707zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" 
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                Selecione um mês para ver a lista de aniversariantes.
              </p>
            </div>
          )}

          {/* Seção de Resultados */}
          {showResults && (
            <div id="results-state">
              <h2 className="text-xl font-semibold mb-4 text-primary-dark">
                Aniversariantes de {getNomeMes(mesSelecionado)}
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <p className="text-gray-600">Carregando...</p>
                </div>
              ) : !aniversariantes || aniversariantes.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum aniversariante encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não há clientes com aniversário em {getNomeMes(mesSelecionado)}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-6 py-4 font-bold text-gray-900">
                          Dia
                        </TableHead>
                        <TableHead className="px-6 py-4 font-bold text-gray-900">
                          Nome do Cliente
                        </TableHead>
                        <TableHead className="px-6 py-4 font-bold text-gray-900">
                          Telefone
                        </TableHead>
                        <TableHead className="px-6 py-4 font-bold text-gray-900">
                          E-mail
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aniversariantes.map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell className="px-6 py-4">
                            {formatarDia(cliente.dataNascimento)}
                          </TableCell>
                          <TableCell className="px-6 py-4 font-medium">
                            {cliente.nome}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-500">
                            {formatarTelefone(cliente.celular, cliente.telefoneFixo)}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-500">
                            {cliente.email ?? "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Footer com total */}
              {aniversariantes && aniversariantes.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Total: {aniversariantes.length} aniversariante{aniversariantes.length !== 1 ? 's' : ''} em {getNomeMes(mesSelecionado)}.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}