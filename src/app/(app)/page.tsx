import Link from "next/link";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function HomePage() {
  const session = await auth();
  
  // Buscar dados do dashboard apenas se o usuário estiver logado
  const stats = session?.user ? await api.dashboard.getStats() : null;

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar o sistema.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-display"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 font-display">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-display text-gray-600">Veículos em Estoque</p>
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
              <p className="text-sm font-display text-gray-600">Valor Total do Estoque</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(stats?.valorTotalEstoque ?? 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Veículos Precisando Atenção */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-display text-gray-600">Precisando Atenção</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.veiculosPrecisandoAtencao ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/veiculos/novo"
          className="bg-primary text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center"
        >
          <div className="text-lg font-bold font-display">Novo Veículo</div>
          <div className="text-sm opacity-90">Cadastrar veículo</div>
        </Link>

        <Link
          href="/clientes/novo"
          className="bg-green-600 text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center"
        >
          <div className="text-lg font-bold font-display">Novo Cliente</div>
          <div className="text-sm opacity-90">Cadastrar cliente</div>
        </Link>

        <Link
          href="/veiculos"
          className="bg-blue-600 text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center"
        >
          <div className="text-lg font-bold font-display">Ver Estoque</div>
          <div className="text-sm opacity-90">Gerenciar veículos</div>
        </Link>

        <Link
          href="/relatorios"
          className="bg-purple-600 text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center"
        >
          <div className="text-lg font-bold font-display">Relatórios</div>
          <div className="text-sm opacity-90">Análises e dados</div>
        </Link>
      </div>

      {/* Resumo de Dados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo de Veículos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold font-display text-gray-900 mb-4">
            Resumo de Veículos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total em Estoque:</span>
              <span className="font-semibold">{stats?.totalVeiculosEmEstoque ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Precisando Atenção:</span>
              <span className="font-semibold">{stats?.veiculosPrecisandoAtencao ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valor Total Estoque:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(stats?.valorTotalEstoque ?? 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Veículos Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold font-display text-gray-900 mb-4">
            Veículos Recentes
          </h3>
          <div className="space-y-3">
            {stats?.veiculosRecemAdicionados?.slice(0, 3).map((veiculo) => (
              <div key={veiculo.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <span className="font-medium text-gray-900">
                    {veiculo.marca} {veiculo.modelo}
                  </span>
                  <p className="text-sm text-gray-500">{veiculo.anoFabricacao}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(veiculo.precoVenda))}
                </span>
              </div>
            )) ?? (
              <p className="text-gray-500 text-sm">Nenhum veículo encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
