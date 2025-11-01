import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Card, Button, Label } from "~/components/ui";

interface DetalhesClientePageProps {
  params: {
    id: string;
  };
}

// Função auxiliar para formatar data
const formatarData = (data: Date | null | undefined): string => {
  if (!data) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
};

// Função auxiliar para formatar telefone
const formatarTelefone = (telefone: string | null | undefined): string => {
  if (!telefone) return "-";
  return telefone;
};

export default async function DetalhesClientePage({ params }: DetalhesClientePageProps) {
  let cliente;
  
  try {
    cliente = await api.cliente.getById({ id: params.id });
  } catch {
    notFound();
  }

  // Formatar endereço completo
  const formatarEndereco = () => {
    const partes = [];
    
    if (cliente.rua) {
      let endereco = cliente.rua;
      if (cliente.numero) {
        endereco += `, ${cliente.numero}`;
      }
      if (cliente.complemento) {
        endereco += `, ${cliente.complemento}`;
      }
      partes.push(endereco);
    }
    
    if (cliente.bairro) {
      partes.push(cliente.bairro);
    }
    
    if (cliente.cidade || cliente.estado) {
      const cidadeEstado = [cliente.cidade, cliente.estado]
        .filter(Boolean)
        .join(" - ");
      if (cidadeEstado) partes.push(cidadeEstado);
    }
    
    if (cliente.cep) {
      partes.push(`CEP: ${cliente.cep}`);
    }
    
    return partes.length > 0 ? partes.join(", ") : "-";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header da Página */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">
            <Link className="hover:underline" href="/clientes">Meus Clientes</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{cliente.nome}</span>
          </p>
          <h1 className="text-3xl font-bold mt-2">{cliente.nome}</h1>
        </div>
        <Link href={`/clientes/${cliente.id}/editar`}>
          <Button variant="primary" className="text-black">
            Editar Cliente
          </Button>
        </Link>
      </div>

      {/* Layout de Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Dados Pessoais */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Dados Pessoais</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
              <p className="text-foreground font-medium">{cliente.nome}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
              <p className="text-foreground">{cliente.cpf ?? "-"}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">RG</Label>
              <p className="text-foreground">{cliente.rg ?? "-"}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
              <p className="text-foreground">{formatarData(cliente.dataNascimento)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Profissão</Label>
              <p className="text-foreground">{cliente.profissao?.nome ?? "-"}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estado Civil</Label>
              <p className="text-foreground">{cliente.estadoCivil?.nome ?? "-"}</p>
            </div>
          </div>
        </Card>

        {/* Card Informações de Contato */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Informações de Contato</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Telefone Celular</Label>
              <p className="text-foreground font-medium">{formatarTelefone(cliente.celular)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Telefone Fixo</Label>
              <p className="text-foreground">{formatarTelefone(cliente.telefoneFixo)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
              <p className="text-foreground">{cliente.email ?? "-"}</p>
            </div>
          </div>
        </Card>

        {/* Card Endereço */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Endereço</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Endereço Completo</Label>
              <p className="text-foreground">{formatarEndereco()}</p>
            </div>
            
            {cliente.rua && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rua</Label>
                  <p className="text-foreground">{cliente.rua}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Número</Label>
                  <p className="text-foreground">{cliente.numero ?? "-"}</p>
                </div>
              </div>
            )}
            
            {(cliente.complemento ?? cliente.bairro) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Complemento</Label>
                  <p className="text-foreground">{cliente.complemento ?? "-"}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Bairro</Label>
                  <p className="text-foreground">{cliente.bairro ?? "-"}</p>
                </div>
              </div>
            )}
            
            {(cliente.cidade ?? cliente.estado ?? cliente.cep) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cidade</Label>
                  <p className="text-foreground">{cliente.cidade ?? "-"}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <p className="text-foreground">{cliente.estado ?? "-"}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CEP</Label>
                  <p className="text-foreground">{cliente.cep ?? "-"}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Card Preferências */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Preferências</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Aceita Marketing</Label>
              <p className="text-foreground">
                {cliente.aceitaMarketing ? (
                  <span className="text-green-600 font-medium">Sim</span>
                ) : (
                  <span className="text-red-600 font-medium">Não</span>
                )}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Anotações de Negócios</Label>
              <p className="text-foreground whitespace-pre-wrap">
                {cliente.observacoesNegocios ?? "-"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}