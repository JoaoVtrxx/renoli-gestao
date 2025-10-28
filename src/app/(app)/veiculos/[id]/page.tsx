"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { notFound } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, Button, Badge } from "~/components/ui";

interface DetalhesVeiculoPageProps {
  params: {
    id: string;
  };
}

// Função auxiliar para mapear status para variantes do Badge
const getStatusVariant = (status: string): "success" | "warning" | "secondary" => {
  switch (status) {
    case "DISPONIVEL":
      return "success";
    case "RESERVADO":
      return "warning";
    case "VENDIDO":
      return "secondary";
    default:
      return "secondary";
  }
};

// Função auxiliar para formatar status
const getStatusText = (status: string): string => {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível";
    case "RESERVADO":
      return "Reservado";
    case "VENDIDO":
      return "Vendido";
    default:
      return status;
  }
};

// Função auxiliar para formatar tipo de transação
const getTipoTransacaoText = (tipoTransacao: string): string => {
  switch (tipoTransacao) {
    case "COMPRA":
      return "Compra";
    case "CONSIGNACAO":
      return "Consignação";
    default:
      return tipoTransacao;
  }
};

export default function DetalhesVeiculoPage({ params }: DetalhesVeiculoPageProps) {
  const [activeTab, setActiveTab] = useState('descricao');
  
  const { data: veiculo, isLoading, isError } = api.veiculo.getById.useQuery({ 
    id: params.id 
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando detalhes do veículo...</p>
        </div>
      </div>
    );
  }

  if (isError || !veiculo) {
    return notFound();
  }

  const veiculoNome = `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""} ${veiculo.anoModelo}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Header da Página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="text-sm text-gray-600 mb-2">
            <Link href="/veiculos" className="hover:text-gray-800">Meu Estoque</Link>
            <span className="mx-1">/</span>
            <span className="font-semibold text-gray-800">{veiculoNome}</span>
          </nav>
          <h2 className="text-3xl font-bold text-gray-800">{veiculoNome}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="flex items-center gap-2" onClick={handlePrint}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Ficha
          </Button>
          <Link href={`/veiculos/${veiculo.id}/editar`}>
            <Button variant="primary" className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Veículo
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Galeria de Fotos - Coluna da Esquerda */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            {veiculo.fotos && veiculo.fotos.length > 0 && veiculo.fotos[0] ? (
              <Image
                src={veiculo.fotos[0]}
                alt={`${veiculoNome} - Foto principal`}
                width={800}
                height={450}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                priority
              />
            ) : (
              <div className="w-full h-[450px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg font-medium">Nenhuma foto disponível</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Miniaturas das Fotos */}
          {veiculo.fotos && veiculo.fotos.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {veiculo.fotos.map((foto, index) => (
                <Image
                  key={index}
                  src={foto}
                  alt={`${veiculoNome} - Foto ${index + 1}`}
                  width={150}
                  height={100}
                  className={`w-full h-auto object-cover rounded cursor-pointer transition-opacity ${
                    index === 0 ? "border-2 border-primary" : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Informações Rápidas - Coluna da Direita */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <p className="text-4xl font-bold text-gray-800 mb-4">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(veiculo.precoVenda))}
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">Ano/Modelo</span>
                <span className="font-semibold text-gray-800">
                  {veiculo.anoFabricacao}/{veiculo.anoModelo}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">KM</span>
                <span className="font-semibold text-gray-800">
                  {veiculo.km ? Number(veiculo.km).toLocaleString("pt-BR") : "Não informado"}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">Cor</span>
                <span className="font-semibold text-gray-800">{veiculo.cor || "Não informado"}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">Câmbio</span>
                <span className="font-semibold text-gray-800">{veiculo.cambio || "Não informado"}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">Placa</span>
                <span className="font-semibold text-gray-800">{veiculo.placa}</span>
              </div>
            </div>

            <div className="mt-6">
              <Badge variant={getStatusVariant(veiculo.status)}>
                {getStatusText(veiculo.status)}
              </Badge>
            </div>

            <div className="mt-6 space-y-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transação de Origem</span>
                <span className="font-semibold text-gray-800">
                  {getTipoTransacaoText(veiculo.tipoTransacao)}
                </span>
              </div>
              
              {veiculo.vendedor && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vendido por</span>
                  <span className="font-semibold text-gray-800">
                    {veiculo.vendedor?.nome ?? "Cliente"}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Abas de Detalhes */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            <button 
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${
                activeTab === 'descricao' 
                  ? 'border-primary text-blue-600 font-bold' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
              }`}
              onClick={() => setActiveTab('descricao')}
            >
              Descrição
            </button>
            <button 
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${
                activeTab === 'opcionais' 
                  ? 'border-primary text-blue-600 font-bold' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
              }`}
              onClick={() => setActiveTab('opcionais')}
            >
              Opcionais
            </button>
            <button 
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${
                activeTab === 'documentos' 
                  ? 'border-primary text-blue-600 font-bold' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
              }`}
              onClick={() => setActiveTab('documentos')}
            >
              Documentos
            </button>
            <button 
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm ${
                activeTab === 'historico' 
                  ? 'border-primary text-blue-600 font-bold' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
              }`}
              onClick={() => setActiveTab('historico')}
            >
              Histórico
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'descricao' && (
            <>
              {veiculo.descricaoAnuncio ? (
                <p className="text-gray-700 leading-relaxed">
                  {veiculo.descricaoAnuncio}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Nenhuma descrição disponível para este veículo.
                </p>
              )}
            </>
          )}
          
          {activeTab === 'opcionais' && (
            <p className="text-gray-500 italic">
              Conteúdo de Opcionais em breve.
            </p>
          )}
          
          {activeTab === 'documentos' && (
            <p className="text-gray-500 italic">
              Conteúdo de Documentos em breve.
            </p>
          )}
          
          {activeTab === 'historico' && (
            <p className="text-gray-500 italic">
              Conteúdo de Histórico em breve.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}