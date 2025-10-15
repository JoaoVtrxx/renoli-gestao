"use client";

import { api } from "~/trpc/react";

export default function DashboardPage() {
  const { data: stats, isLoading } = api.dashboard.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Veículos em Estoque */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Veículos em Estoque
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.totalVeiculosEmEstoque ?? 0}
          </p>
        </div>

        {/* Valor Total do Estoque */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Valor Total do Estoque
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            R$ {stats?.valorTotalEstoque ? Number(stats.valorTotalEstoque).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
          </p>
        </div>

        {/* Veículos Precisando Atenção */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Sem Fotos
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats?.veiculosPrecisandoAtencao ?? 0}
          </p>
        </div>

        {/* Total de Adições Recentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Adições Recentes
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.veiculosRecemAdicionados?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Veículos Recém Adicionados */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Veículos Recém Adicionados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.veiculosRecemAdicionados?.map((veiculo) => (
                <tr key={veiculo.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {veiculo.marca} {veiculo.modelo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {veiculo.anoFabricacao}/{veiculo.anoModelo} • {veiculo.placa}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {veiculo.vendedor.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {Number(veiculo.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      veiculo.status === 'DISPONIVEL' ? 'bg-green-100 text-green-800' :
                      veiculo.status === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {veiculo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(veiculo.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}