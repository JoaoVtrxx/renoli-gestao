 "use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { StatusVeiculo, TipoTransacao } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { env } from "~/env";
import toast from "react-hot-toast";
import { Input, Label, Select, Textarea, Card, Button } from "~/components/ui";

const createVeiculoSchema = z.object({
  placa: z.string().min(7, "A placa deve ter no mínimo 7 caracteres"),
  marca: z.string().min(2, "A marca é obrigatória"),
  modelo: z.string().min(1, "O modelo é obrigatório"),
  anoFabricacao: z.coerce.number().int().min(1900),
  anoModelo: z.coerce.number().int().min(1900),
  cor: z.string().min(3, "A cor é obrigatória"),
  km: z.coerce.number().int().min(0),
  precoVenda: z.coerce.number(),
  cambio: z.string().min(3, "O câmbio é obrigatório"),
  combustivel: z.string().min(3, "O combustível é obrigatório"),
  portas: z.coerce.number().int(),
  status: z.nativeEnum(StatusVeiculo),
  tipoTransacao: z.nativeEnum(TipoTransacao),
  clienteIdVendedor: z.string({ required_error: "Selecione o cliente vendedor."}),
  descricaoAnuncio: z.string().optional(),
  observacoesInternas: z.string().optional(),
  fotos: z.array(z.string()).default([]),
});

type CreateVeiculoInput = z.infer<typeof createVeiculoSchema>;

interface VeiculoFormProps {
  initialData?: Partial<CreateVeiculoInput & { id: string }>;
}

export default function VeiculoForm({ initialData }: VeiculoFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado para gerenciar URLs das fotos
  const [fotosUrls, setFotosUrls] = useState<string[]>(initialData?.fotos ?? []);

  const form = useForm({
    resolver: zodResolver(createVeiculoSchema),
    defaultValues: {
      status: StatusVeiculo.DISPONIVEL,
      tipoTransacao: TipoTransacao.COMPRA,
      fotos: [],
      ...initialData,
    },
  });

  // Mutation para gerar presigned URL
  const { mutate: createPresignedUrl } = api.veiculo.createPresignedUrl.useMutation();

  // Função para lidar com o drop de arquivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Gerar presigned URL
      createPresignedUrl({ fileType: file.type }, {
        onSuccess: (data) => {
          // Fazer upload do arquivo para a URL assinada
          fetch(data.url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          }).then(uploadResponse => {
            if (uploadResponse.ok) {
              // Construir URL pública da imagem
              const publicUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
              
              // Adicionar URL ao estado e ao formulário
              setFotosUrls(prev => {
                const newUrls = [...prev, publicUrl];
                form.setValue('fotos', newUrls);
                return newUrls;
              });
              toast.success('Foto enviada com sucesso!');
            } else {
              toast.error('Erro no upload da foto');
            }
          }).catch(() => {
            toast.error('Erro no upload da foto');
          });
        },
        onError: (_error) => {
          toast.error('Erro ao preparar upload da foto');
        }
      });
    });
  }, [createPresignedUrl, form]);  // Configuração do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  // Função para remover foto
  const removeFoto = (indexToRemove: number) => {
    setFotosUrls(prev => {
      const newUrls = prev.filter((_, index) => index !== indexToRemove);
      form.setValue('fotos', newUrls);
      return newUrls;
    });
  };

  const { mutate: createVeiculo, isPending: isCreating } = api.veiculo.create.useMutation({
    onSuccess: () => {
      toast.success("Veículo salvo com sucesso!");
      form.reset();
      router.push("/veiculos");
    },
    onError: (_error) => {
      toast.error("Houve um erro ao salvar o veículo.");
    },
  });

  const { mutate: updateVeiculo, isPending: isUpdating } = api.veiculo.update.useMutation({
    onSuccess: () => {
      toast.success("Veículo atualizado com sucesso!");
      router.push("/veiculos");
    },
    onError: (_error) => {
      toast.error("Houve um erro ao salvar o veículo.");
    },
  });

  const { mutate: deleteVeiculo, isPending: isDeleting } = api.veiculo.delete.useMutation({
    onSuccess: () => {
      toast.success("Veículo excluído com sucesso!");
      router.push("/veiculos");
    },
    onError: (_error) => {
      toast.error("Houve um erro ao excluir o veículo.");
    },
  });

  const isPending = isCreating || isUpdating || isDeleting;

  function onSubmit(data: CreateVeiculoInput) {
    if (initialData?.id) {
      // Modo de edição - usar update mutation
      updateVeiculo({
        id: initialData.id,
        ...data,
      });
    } else {
      // Modo de criação - usar create mutation
      createVeiculo(data);
    }
  }

  const { data: clientes, isLoading: isLoadingClientes } = api.cliente.getAll.useQuery({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <p className="text-sm text-muted">
          <a className="hover:underline" href="/veiculos">Meu Estoque</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{initialData ? "Editar Veículo" : "Cadastrar Novo Veículo"}</span>
        </p>
        <h1 className="text-3xl font-bold mt-2">{initialData ? "Editar Veículo" : "Cadastrar Novo Veículo"}</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Informações Básicas do Veículo */}
            <Card>
              <h2 className="text-xl font-bold mb-6">Informações Básicas do Veículo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    type="text"
                    placeholder="Selecione a marca"
                    {...form.register("marca")}
                  />
                  {form.formState.errors.marca && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.marca.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    type="text"
                    placeholder="Selecione o modelo"
                    {...form.register("modelo")}
                  />
                  {form.formState.errors.modelo && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.modelo.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="versao">Versão</Label>
                  <Input
                    id="versao"
                    type="text"
                    placeholder="Selecione a versão"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ano">Ano</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="anoFabricacao"
                      type="number"
                      placeholder="Fabricação"
                      {...form.register("anoFabricacao")}
                    />
                    <Input
                      id="anoModelo"
                      type="number"
                      placeholder="Modelo"
                      {...form.register("anoModelo")}
                    />
                  </div>
                  {(form.formState.errors.anoFabricacao ?? form.formState.errors.anoModelo) && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.anoFabricacao?.message ?? form.formState.errors.anoModelo?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    type="text"
                    placeholder="Selecione a cor"
                    {...form.register("cor")}
                  />
                  {form.formState.errors.cor && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.cor.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="km">KM</Label>
                  <Input
                    id="km"
                    type="number"
                    placeholder="Digite a quilometragem"
                    {...form.register("km")}
                  />
                  {form.formState.errors.km && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.km.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cambio">Câmbio</Label>
                  <Select id="cambio" {...form.register("cambio")}>
                    <option value="">Selecione o tipo de câmbio</option>
                    <option value="manual">Manual</option>
                    <option value="automatico">Automático</option>
                    <option value="cvt">CVT</option>
                  </Select>
                  {form.formState.errors.cambio && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.cambio.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="portas">Número de Portas</Label>
                  <Input
                    id="portas"
                    type="number"
                    placeholder="Digite o número de portas"
                    {...form.register("portas")}
                  />
                  {form.formState.errors.portas && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.portas.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="combustivel">Combustível</Label>
                  <Select id="combustivel" {...form.register("combustivel")}>
                    <option value="">Selecione o tipo de combustível</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="etanol">Etanol</option>
                    <option value="flex">Flex</option>
                    <option value="diesel">Diesel</option>
                    <option value="eletrico">Elétrico</option>
                    <option value="hibrido">Híbrido</option>
                  </Select>
                  {form.formState.errors.combustivel && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.combustivel.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    type="text"
                    maskOptions={{ mask: "aaa-9*99" }}
                    placeholder="ABC-1234"
                    {...form.register("placa")}
                  />
                  {form.formState.errors.placa && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.placa.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="chassi">Chassi</Label>
                  <Input
                    id="chassi"
                    type="text"
                    placeholder="Digite o chassi"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="renavam">RENAVAM</Label>
                  <Input
                    id="renavam"
                    type="text"
                    placeholder="Digite o RENAVAM"
                  />
                </div>
              </div>
            </Card>

            {/* Preços e Status */}
            <Card>
              <h2 className="text-xl font-bold mb-6">Preços e Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <Label htmlFor="precoVenda">Preço de Venda</Label>
                  <Input
                    id="precoVenda"
                    type="number"
                    step="0.01"
                    placeholder="R$ 0,00"
                    {...form.register("precoVenda")}
                  />
                  {form.formState.errors.precoVenda && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.precoVenda.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="precoCusto">Preço de Custo</Label>
                  <Input
                    id="precoCusto"
                    type="number"
                    step="0.01"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Status</p>
                <div className="flex gap-4">
                  <label className="flex items-center px-4 py-2 rounded-lg border-2 border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      value="DISPONIVEL"
                      {...form.register("status")}
                      className="sr-only"
                    />
                    <span className="font-medium">Disponível</span>
                  </label>
                  <label className="flex items-center px-4 py-2 rounded-lg border-2 border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      value="RESERVADO"
                      {...form.register("status")}
                      className="sr-only"
                    />
                    <span className="font-medium">Reservado</span>
                  </label>
                  <label className="flex items-center px-4 py-2 rounded-lg border-2 border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      value="VENDIDO"
                      {...form.register("status")}
                      className="sr-only"
                    />
                    <span className="font-medium">Vendido</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Dados de Aquisição */}
            <Card>
              <h2 className="text-xl font-bold mb-6">Dados de Aquisição</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label htmlFor="tipoTransacao">Tipo de Transação <span className="text-red-500">*</span></Label>
                  <Select id="tipoTransacao" {...form.register("tipoTransacao")} required>
                    <option value="" disabled>Selecione o tipo</option>
                    <option value="COMPRA">Compra</option>
                    <option value="CONSIGNACAO">Consignação</option>
                    <option value="LOJA">Loja</option>
                  </Select>
                  {form.formState.errors.tipoTransacao && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.tipoTransacao.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="clienteIdVendedor">Cliente Vendedor</Label>
                  <Select id="clienteIdVendedor" {...form.register("clienteIdVendedor")}>
                    <option value="">Selecione um cliente</option>
                    {isLoadingClientes ? (
                      <option>Carregando...</option>
                    ) : (
                      clientes?.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))
                    )}
                  </Select>
                  {form.formState.errors.clienteIdVendedor && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.clienteIdVendedor.message}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Descrição e Observações */}
            <Card>
              <h2 className="text-xl font-bold mb-6">Descrição e Observações</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="descricaoAnuncio" className="mb-2 block">Descrição do Veículo</Label>
                  <Textarea
                    id="descricaoAnuncio"
                    rows={5}
                    placeholder="Digite a descrição do veículo"
                    {...form.register("descricaoAnuncio")}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoesInternas" className="mb-2 block">Observações (Internas)</Label>
                  <Textarea
                    id="observacoesInternas"
                    rows={3}
                    placeholder="Digite observações sobre o veículo"
                    {...form.register("observacoesInternas")}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold mb-6">Fotos do Veículo</h2>
              
              {/* Área de Upload */}
              <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center mb-6 cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-border'
                }`}
              >
                <input {...getInputProps()} />
                <p className="font-bold text-lg mb-1">Arraste e solte as fotos aqui ou</p>
                <button type="button" className="font-semibold text-primary hover:underline">
                  Selecione as fotos
                </button>
              </div>

              {/* Grade de Fotos */}
              {fotosUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {fotosUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary">
                        <Image
                          src={url}
                          alt={`Foto ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFoto(index)}
                        title={`Remover foto ${index + 1}`}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
                          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                        </svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Footer de Ações */}
        <footer className="mt-12 pt-8 border-t border-border flex items-center justify-between">
          {initialData && (
            <Button
              type="button"
              variant="secondary"
              className="text-red-600 hover:text-red-700"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
                  deleteVeiculo({ id: String(initialData?.id ?? 0) });
                }
              }}
              disabled={isPending}
            >
              Excluir Veículo
            </Button>
          )}
          <div className="flex items-center gap-4 ml-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
            >
              {isPending ? 'Salvando...' : (initialData ? 'Atualizar Veículo' : 'Salvar Veículo')}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}