"use client";

import Sidebar from "~/components/layout/Sidebar";

export default function SidebarDemoPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-primary mb-8">
            Demonstração do Componente Sidebar
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Funcionalidades Implementadas
            </h2>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Design System:</strong> Usa as cores <code>bg-sidebar</code> e <code>text-white</code></span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Navegação:</strong> Links para todas as rotas principais (/, /veiculos, /clientes, /relatorios, /configuracoes)</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Link Ativo:</strong> Destaca a rota atual com <code>bg-primary/20</code> e borda</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Hook usePathname:</strong> Detecta a rota atual automaticamente</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Ícones SVG:</strong> Cada item tem um ícone representativo</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Hover Effects:</strong> Feedback visual ao passar o mouse</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                <span><strong>Fonte Inter:</strong> Usa <code>font-display</code> em todos os textos</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Teste de Navegação
            </h2>
            
            <p className="text-gray-700 mb-4">
              Clique nos links da sidebar para testar a funcionalidade de link ativo:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-display font-semibold text-primary mb-2">Início (/)</h3>
                <p className="text-sm text-gray-600">Dashboard principal com estatísticas</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-display font-semibold text-primary mb-2">Veículos</h3>
                <p className="text-sm text-gray-600">Gestão e cadastro de veículos</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-display font-semibold text-primary mb-2">Clientes</h3>
                <p className="text-sm text-gray-600">Cadastro e gestão de clientes</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-display font-semibold text-primary mb-2">Relatórios</h3>
                <p className="text-sm text-gray-600">Aniversariantes e auditoria</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-display font-semibold text-primary mb-2">Configurações</h3>
                <p className="text-sm text-gray-600">Profissões e estados civis</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Código do Componente
            </h2>
            
            <p className="text-gray-700 mb-4">
              O componente foi criado em: <code className="bg-gray-100 px-2 py-1 rounded">src/components/layout/Sidebar.tsx</code>
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800 overflow-x-auto">
{`// Uso do componente
import Sidebar from "~/components/layout/Sidebar";

<div className="flex min-h-screen bg-background">
  <Sidebar />
  <main className="flex-1 p-8">
    {/* Conteúdo principal */}
  </main>
</div>`}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}