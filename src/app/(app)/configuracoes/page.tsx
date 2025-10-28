import Link from "next/link";
import { Card, Button } from "~/components/ui";

export default function ConfiguracoesPage() {
  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
            Configurações Gerais
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie as configurações do sistema e os dados de referência.
          </p>
        </div>

        {/* Grid de Cards de Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Gerenciar Profissões */}
          <Card className="p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M8 10h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-dark">
                  Gerenciar Profissões
                </h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 flex-grow">
              Adicione ou edite as profissões disponíveis para cadastro de clientes.
            </p>
            
            <div className="mt-auto">
              <Link href="/configuracoes/profissoes" className="w-full block">
                <Button variant="secondary" className="w-full">
                  Acessar
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2: Gerenciar Estados Civis */}
          <Card className="p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-dark">
                  Gerenciar Estados Civis
                </h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 flex-grow">
              Adicione ou edite os estados civis disponíveis para cadastro de clientes.
            </p>
            
            <div className="mt-auto">
              <Link href="/configuracoes/estados-civis" className="w-full block">
                <Button variant="secondary" className="w-full">
                  Acessar
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Cards Placeholder para futuras configurações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Placeholder 1 */}
          <Card className="p-6 flex flex-col opacity-50">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-400">
                  Configurações Gerais
                </h3>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 flex-grow">
              Configurações avançadas do sistema e preferências.
            </p>
            
            <div className="mt-auto">
              <Button variant="secondary" className="w-full" disabled>
                Em Breve
              </Button>
            </div>
          </Card>

          {/* Placeholder 2 */}
          <Card className="p-6 flex flex-col opacity-50">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-400">
                  Gerenciar Usuários
                </h3>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 flex-grow">
              Gerencie usuários do sistema e suas permissões.
            </p>
            
            <div className="mt-auto">
              <Button variant="secondary" className="w-full" disabled>
                Em Breve
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}