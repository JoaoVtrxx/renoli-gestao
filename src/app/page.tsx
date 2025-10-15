// Em: src/app/page.tsx

import Link from "next/link";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function HomePage() {
  const session = await auth();
  
  // Buscar dados do dashboard apenas se o usuário estiver logado
  const stats = session?.user ? await api.dashboard.getStats() : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {session?.user ? (
        // Dashboard para usuários logados
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard - Sistema Renoli
            </h1>
            <p className="text-gray-600">
              Bem-vindo, {session.user.name}!
            </p>
          </div>

          {/* Cards de Resumo (KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total de Veículos em Estoque */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Veículos em Estoque
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalVeiculosEmEstoque ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Valor Total do Estoque */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Valor Total do Estoque
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.valorTotalEstoque 
                      ? Number(stats.valorTotalEstoque).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })
                      : 'R$ 0,00'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Veículos Precisando Atenção */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Veículos Sem Fotos
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats?.veiculosPrecisandoAtencao ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/veiculos/novo"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Cadastrar Novo Veículo
              </Link>
              <Link
                href="/clientes/novo"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Cadastrar Novo Cliente
              </Link>
            </div>
          </div>

          {/* Últimos Veículos Adicionados */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Últimos Veículos Adicionados</h2>
            </div>
            <div className="overflow-x-auto">
              {stats?.veiculosRecemAdicionados && stats.veiculosRecemAdicionados.length > 0 ? (
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
                    {stats.veiculosRecemAdicionados.map((veiculo) => (
                      <tr key={veiculo.id} className="hover:bg-gray-50">
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
                          {Number(veiculo.precoVenda).toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
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
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">Nenhum veículo cadastrado ainda.</p>
                  <Link
                    href="/veiculos/novo"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-500"
                  >
                    Cadastrar o primeiro veículo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Página de boas-vindas para usuários não logados
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Sistema <span className="text-[hsl(280,100%,70%)]">Renoli</span> Veículos
            </h1>
            
            <p className="text-xl text-center max-w-2xl">
              Sistema completo de gestão de veículos com controle de estoque, 
              cadastro de clientes e dashboard administrativo.
            </p>
            
            <Link
              href="/api/auth/signin"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}