"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import ClienteForm from "../../_components/ClienteForm";

export default function EditarClientePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, isSuccess } = api.cliente.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg 
              className="mx-auto h-16 w-16 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cliente não encontrado</h1>
          <p className="text-gray-600 mb-6">
            O cliente que você está tentando editar não existe ou foi removido.
          </p>
          <Link 
            href="/clientes" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para a lista de clientes
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess && data) {
    // Transformar os dados do cliente para o formato esperado pelo formulário
    const initialData = {
      id: data.id,
      nome: data.nome,
      cpf: data.cpf ?? undefined,
      rg: data.rg ?? undefined,
      // Converter DateTime para string no formato yyyy-MM-dd
      dataNascimento: data.dataNascimento 
        ? data.dataNascimento.toISOString().split('T')[0] 
        : undefined,
      celular: data.celular,
      telefoneFixo: data.telefoneFixo ?? undefined,
      email: data.email ?? undefined,
      cep: data.cep ?? undefined,
      rua: data.rua ?? undefined,
      numero: data.numero ?? undefined,
      complemento: data.complemento ?? undefined,
      bairro: data.bairro ?? undefined,
      cidade: data.cidade ?? undefined,
      estado: data.estado ?? undefined,
      aceitaMarketing: data.aceitaMarketing,
      observacoesNegocios: data.observacoesNegocios ?? undefined,
      profissaoId: data.profissaoId ?? undefined,
      estadoCivilId: data.estadoCivilId ?? undefined,
    };

    return <ClienteForm initialData={initialData} />;
  }

  return null;
}