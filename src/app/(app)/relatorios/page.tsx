"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

type Cliente = {
  id: string;
  nome: string;
  cpf: string | null;
  rg: string | null;
  dataNascimento: Date | null;
  celular: string;
  telefoneFixo: string | null;
  email: string | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  aceitaMarketing: boolean;
  observacoesNegocios: string | null;
  createdAt: Date;
  updatedAt: Date;
  profissaoId: string | null;
  estadoCivilId: string | null;
};

export default function RelatoriosPage() {
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  
  const { data: aniversariantes, isLoading, refetch } = api.relatorio.getAniversariantesDoMes.useQuery(
    { mes: mesSelecionado },
    { enabled: !!mesSelecionado }
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

  const handleMesChange = (novoMes: number) => {
    setMesSelecionado(novoMes);
    void refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Relatórios</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Aniversariantes do Mês</h2>
        
        {/* Seletor de Mês */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o mês:
          </label>
          <select
            value={mesSelecionado}
            onChange={(e) => handleMesChange(Number(e.target.value))}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            title="Selecione o mês para buscar aniversariantes"
          >
            {meses.map((mes) => (
              <option key={mes.valor} value={mes.valor}>
                {mes.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Resultados */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando...</span>
          </div>
        ) : (
          <div>
            {aniversariantes && aniversariantes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Nascimento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Celular
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aniversariantes.map((cliente: Cliente) => (
                      <tr key={cliente.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cliente.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.dataNascimento 
                            ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')
                            : 'Não informado'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.celular ?? 'Não informado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.email ?? 'Não informado'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4 text-sm text-gray-600">
                  {aniversariantes.length} aniversariante(s) encontrado(s) em {meses.find(m => m.valor === mesSelecionado)?.nome}.
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 7l4 4m0 0l4-4m-4 4V7" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum aniversariante</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há clientes aniversariando em {meses.find(m => m.valor === mesSelecionado)?.nome}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}