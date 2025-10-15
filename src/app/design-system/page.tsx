"use client";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-display font-bold text-primary mb-8">
          Design System - Renoli Gestão
        </h1>
        
        {/* Demonstração das Cores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-full h-32 bg-primary rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Primary</h3>
            <p className="text-gray-600 font-mono">#133d90</p>
            <p className="text-sm text-gray-500 mt-2">
              Cor principal para botões, links e elementos de destaque
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-full h-32 bg-sidebar rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sidebar</h3>
            <p className="text-gray-600 font-mono">#0B2A4F</p>
            <p className="text-sm text-gray-500 mt-2">
              Cor para sidebars, navegação e elementos de apoio
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-full h-32 bg-background rounded-lg mb-4 border-2 border-gray-200"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Background</h3>
            <p className="text-gray-600 font-mono">#f6f6f8</p>
            <p className="text-sm text-gray-500 mt-2">
              Cor de fundo principal da aplicação
            </p>
          </div>
        </div>
        
        {/* Demonstração da Fonte */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-display font-bold text-primary mb-6">
            Tipografia - Inter Font
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Heading 1</h3>
              <p className="text-4xl font-display font-bold text-gray-900">
                Sistema Renoli - Gestão de Veículos
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Heading 2</h3>
              <p className="text-2xl font-display font-semibold text-gray-800">
                Dashboard e Relatórios Integrados
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Body Text</h3>
              <p className="text-base font-display text-gray-600">
                Esta é uma demonstração do sistema de tipografia usando a fonte Inter. 
                A fonte foi configurada como display family no Tailwind CSS v4, 
                proporcionando uma aparência moderna e legível em todos os dispositivos.
              </p>
            </div>
          </div>
        </div>
        
        {/* Demonstração de Componentes */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-display font-bold text-primary mb-6">
            Componentes com Nova Paleta
          </h2>
          
          <div className="space-y-6">
            {/* Botões */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Botões</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 bg-primary text-white font-display font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Botão Primary
                </button>
                <button className="px-6 py-2 bg-sidebar text-white font-display font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Botão Sidebar
                </button>
                <button className="px-6 py-2 border-2 border-primary text-primary font-display font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
                  Botão Outline
                </button>
              </div>
            </div>
            
            {/* Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border-l-4 border-primary bg-gray-50 rounded-r-lg">
                  <h4 className="font-display font-semibold text-primary mb-2">Card com Primary</h4>
                  <p className="text-gray-600 font-display">
                    Este card utiliza a cor primary como destaque.
                  </p>
                </div>
                <div className="p-6 border-l-4 border-sidebar bg-gray-50 rounded-r-lg">
                  <h4 className="font-display font-semibold text-sidebar mb-2">Card com Sidebar</h4>
                  <p className="text-gray-600 font-display">
                    Este card utiliza a cor sidebar como destaque.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}