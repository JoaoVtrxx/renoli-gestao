import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Card, Button, Label } from "~/components/ui";
import {
  User,
  Cake,
  Briefcase,
  Heart,
  Phone,
  Mail,
  MapPin,
  FileText,
  Pencil,
  CheckCircle,
  XCircle,
  Building,
  ClipboardList,
} from "lucide-react";

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

// Helper component for displaying information items with icons
const InfoItem = ({
  icon: Icon,
  label,
  value,
  multiline = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
}) => {
  if (!value) {
    value = "-";
  }

  return (
    <div>
      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      {multiline ? (
        <p className="text-foreground whitespace-pre-wrap mt-1">{value}</p>
      ) : (
        <p className="text-foreground font-medium mt-1">{value}</p>
      )}
    </div>
  );
};

export default async function DetalhesClientePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let cliente;
  
  try {
    cliente = await api.cliente.getById({ id: resolvedParams.id });
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
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link className="hover:underline" href="/clientes">Meus Clientes</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{cliente.nome}</span>
          </p>
          <h1 className="text-4xl font-bold tracking-tight mt-1">{cliente.nome}</h1>
        </div>
        <Link href={`/clientes/${cliente.id}/editar`}>
          <Button variant="primary" className="text-black flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>

      {/* Layout de Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Principal (Esquerda) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card Dados Pessoais */}
          <Card>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoItem icon={User} label="Nome Completo" value={cliente.nome} />
              <InfoItem icon={ClipboardList} label="CPF" value={cliente.cpf} />
              <InfoItem icon={ClipboardList} label="RG" value={cliente.rg} />
              <InfoItem icon={Cake} label="Data de Nascimento" value={formatarData(cliente.dataNascimento)} />
              <InfoItem icon={Briefcase} label="Profissão" value={cliente.profissao?.nome} />
              <InfoItem icon={Heart} label="Estado Civil" value={cliente.estadoCivil?.nome} />
            </div>
          </Card>

          {/* Card Endereço */}
          <Card>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              Endereço
            </h2>
            <div className="space-y-6">
              <InfoItem icon={MapPin} label="Endereço Completo" value={formatarEndereco()} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-6">
                <InfoItem icon={Building} label="Cidade" value={cliente.cidade} />
                <InfoItem icon={Building} label="Estado" value={cliente.estado} />
                <InfoItem icon={Building} label="Bairro" value={cliente.bairro} />
                <InfoItem icon={Building} label="CEP" value={cliente.cep} />
              </div>
            </div>
          </Card>

        </div>

        {/* Coluna Lateral (Direita) */}
        <div className="space-y-8">

          {/* Card Informações de Contato */}
          <Card>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Phone className="h-6 w-6 text-primary" />
              Informações de Contato
            </h2>
            <div className="space-y-6">
              <InfoItem icon={Phone} label="Telefone Celular" value={formatarTelefone(cliente.celular)} />
              <InfoItem icon={Phone} label="Telefone Fixo" value={formatarTelefone(cliente.telefoneFixo)} />
              <InfoItem icon={Mail} label="E-mail" value={cliente.email} />
            </div>
          </Card>

          {/* Card Preferências */}
          <Card>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-primary" />
              Preferências e Anotações
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Aceita Marketing
                </Label>
                {cliente.aceitaMarketing ? (
                  <p className="font-medium flex items-center gap-2 mt-1 text-green-600">
                    <CheckCircle className="h-4 w-4" /> Sim
                  </p>
                ) : (
                  <p className="font-medium flex items-center gap-2 mt-1 text-red-600">
                    <XCircle className="h-4 w-4" /> Não
                  </p>
                )}
              </div>
              <InfoItem icon={FileText} label="Anotações de Negócios" value={cliente.observacoesNegocios} multiline />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}