import Link from "next/link";
import { Card, Button } from "~/components/ui";

export default function RelatoriosPage() {
  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header com Breadcrumb */}
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2" role="list">
              <li>
                <div>
                  <a className="text-sm font-medium text-gray-500 hover:text-primary-dark" href="#">
                    Início
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-primary-dark">
                    Central de Relatórios
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark">
            Central de Relatórios
          </h1>
        </div>

        {/* Grid de Cards de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Aniversariantes do Mês */}
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-primary-dark mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">
              Aniversariantes do Mês
            </h3>
            <p className="text-sm text-gray-500 flex-grow mb-6">
              Lista de clientes que fazem aniversário neste mês.
            </p>
            <Link href="/relatorios/aniversariantes" className="w-full">
              <Button variant="primary" className="text-black w-full">
                Acessar Relatório
              </Button>
            </Link>
          </Card>

          {/* Card 2: Auditoria de Inserção de Veículos */}
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-primary-dark mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">
              Auditoria de Inserção de Veículos
            </h3>
            <p className="text-sm text-gray-500 flex-grow mb-6">
              Relatório de veículos inseridos no sistema por período.
            </p>
            <Link href="/relatorios/auditoria" className="w-full">
              <Button variant="primary" className="text-black w-full">
                Acessar Relatório
              </Button>
            </Link>
          </Card>

          {/* Card Placeholder para futuros relatórios */}
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 opacity-50">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">
              Vendas por Modelo
            </h3>
            <p className="text-sm text-gray-400 flex-grow mb-6">
              Análise das vendas por modelo de veículo.
            </p>
            <Button variant="secondary" className="w-full" disabled>
              Em Breve
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}