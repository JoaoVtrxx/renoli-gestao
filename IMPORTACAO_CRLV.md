# Funcionalidade de Importação Automática de CRLV

## 📋 Visão Geral

Implementação de um sistema de importação automática de dados do CRLV (Certificado de Registro e Licenciamento de Veículo) Digital em formato PDF para o formulário de cadastro de veículos.

## 🎯 Objetivo

Permitir que o usuário faça upload de um PDF do CRLV Digital e tenha os campos do formulário preenchidos automaticamente, reduzindo erros de digitação e agilizando o processo de cadastro.

## 🏗️ Arquitetura da Solução

### Backend (tRPC + pdf-parse)

#### 1. **Dependências Instaladas**

- `pdf-parse`: Biblioteca v2 para extração de texto, imagens e tabelas de arquivos PDF (TypeScript puro)
- `@napi-rs/canvas`: Dependência nativa necessária para o pdf-parse funcionar no Node.js

**Versão do pdf-parse**: 2.4.5 (ESM/CJS dual-mode)

**Importante**: Esta versão usa a classe `PDFParse` ao invés da função direta da v1.

#### 2. **Router: `src/server/api/routers/veiculo.ts`**

##### **Nova Mutation: `parseDocument`**

```typescript
parseDocument: protectedProcedure
  .input(z.object({ pdfBase64: z.string() }))
  .mutation(async ({ input }) => {
    // Converte base64 para Buffer
    // Usa PDFParse class (v2) para extrair texto e info do PDF
    // Faz parsing do texto usando regex
    // Retorna objeto com dados extraídos
  });
```

**Detalhes da Implementação:**

```typescript
// Interface para o retorno do pdf-parse v2
interface PDFData {
  text: string;
  numPages: number;
}

// Importação dinâmica do pdf-parse (otimizado para uso)
async function parsePDF(buffer: Buffer): Promise<PDFData> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  const textResult = await parser.getText();
  const infoResult = await parser.getInfo();

  return {
    text: textResult.text,
    numPages: infoResult.total,
  };
}
```

**Por que usamos `await import()`?**

- Compatibilidade com Next.js 15 + Turbopack
- Evita problemas de importação CommonJS vs ESM
- pdf-parse v2 é um módulo ESM puro

**Entrada:**

- `pdfBase64`: String em base64 do arquivo PDF

**Retorno:**

```typescript
{
  success: true,
  data: {
    placa: string | null,
    renavam: string | null,
    chassi: string | null,
    marca: string | null,
    modelo: string | null,
    anoFabricacao: number | null,
    anoModelo: number | null,
    cor: string | null
  }
}
```

##### **Função Auxiliar: `parseCRLVText`**

Extrai dados estruturados do texto bruto usando expressões regulares calibradas para o padrão brasileiro de CRLV:

**Campos Extraídos:**

- **Placa**: Padrão Mercosul (LLLNLNN) ou antiga (LLLNNNN)
  - Regex: `PLACA\s*[:\-]?\s*([A-Z]{3}[0-9][A-Z0-9][0-9]{2})`
- **RENAVAM**: 11 dígitos
  - Regex: `(?:CÓDIGO\s+)?RENAVAM\s*[:\-]?\s*(\d{11})`
- **Chassi**: 17 caracteres alfanuméricos
  - Regex: `(?:N[UÚ]MERO\s+DO\s+)?CHASSI\s*[:\-]?\s*([A-HJ-NPR-Z0-9]{17})`
- **Marca/Modelo**: Texto após "MARCA/MODELO/VERSÃO"
  - Extração inteligente com split para separar marca (primeira palavra) e modelo (resto)
- **Ano Fabricação**: 4 dígitos
  - Regex: `ANO\s+(?:DE\s+)?FABRICA[CÇ][ÃA]O\s*[:\-]?\s*(\d{4})`
- **Ano Modelo**: 4 dígitos
  - Regex: `ANO\s+(?:DO\s+)?MODELO\s*[:\-]?\s*(\d{4})`
- **Cor**: Texto após "COR PREDOMINANTE"
  - Regex com lookahead para capturar até o próximo campo

### Frontend (React + tRPC)

#### 1. **VeiculoForm Component** (`src/app/(app)/veiculos/_components/VeiculoForm.tsx`)

##### **Estados Adicionados:**

```typescript
const [isParsingDocument, setIsParsingDocument] = useState(false);
```

##### **Mutation Hook:**

```typescript
const { mutate: parseDocument } = api.veiculo.parseDocument.useMutation({
  onSuccess: (result) => {
    // Preenche os campos do formulário com form.setValue()
    // Exibe toast de sucesso
  },
  onError: (error) => {
    // Exibe mensagem de erro
  },
});
```

##### **Função de Conversão para Base64:**

```typescript
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = result.split(",")[1];
      resolve(base64Data);
    };
  });
};
```

##### **Handler de Upload:**

```typescript
const handleCRLVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  // Validações: tipo de arquivo e tamanho
  // Converte para base64
  // Chama mutation parseDocument
};
```

##### **UI Component:**

Card de destaque com:

- Ícone de upload
- Botão "Selecionar CRLV (PDF)"
- Indicador de loading durante processamento
- Input file oculto (apenas PDF, máx 10MB)
- Mensagens de feedback via toast

**Validações:**

- Tipo de arquivo: apenas `application/pdf`
- Tamanho máximo: 10MB
- Exibido apenas no modo de criação (não no modo de edição)

## 📊 Fluxo de Dados

```
1. Usuário seleciona PDF do CRLV
   ↓
2. Frontend valida arquivo (tipo e tamanho)
   ↓
3. Arquivo é convertido para Base64
   ↓
4. Base64 enviado via tRPC para backend
   ↓
5. Backend converte Base64 → Buffer
   ↓
6. pdf-parse extrai texto do PDF
   ↓
7. parseCRLVText faz regex no texto
   ↓
8. Dados estruturados retornam ao frontend
   ↓
9. form.setValue() preenche campos automaticamente
   ↓
10. Toast de sucesso informa quantos campos foram preenchidos
```

## 🎨 UX/UI

### Design do Card de Importação

- **Cor de destaque**: Azul (`bg-blue-50`, `border-blue-200`)
- **Ícone**: Upload com nuvem (SVG inline)
- **Título**: "Importar dados do CRLV Digital"
- **Descrição**: Texto explicativo sobre a funcionalidade
- **Botão**: Com estado de loading e spinner animado
- **Informação adicional**: "Tamanho máximo: 10MB"

### Feedback ao Usuário

- **Loading**: Spinner animado + texto "Processando..."
- **Sucesso**: Toast verde com contador de campos preenchidos
- **Erro**: Toast vermelho com mensagem específica do erro

## 🔧 Campos do Schema Atualizados

Adicionados ao schema do formulário:

```typescript
chassi: z.string().optional(),
renavam: z.string().optional(),
versao: z.string().optional(),
```

## 🚀 Uso

1. Acesse a página de **Cadastrar Novo Veículo** (`/veiculos/novo`)
2. Clique no botão **"Selecionar CRLV (PDF)"** no card azul no topo
3. Selecione o arquivo PDF do CRLV Digital
4. Aguarde o processamento (indicador de loading)
5. Campos serão preenchidos automaticamente
6. Revise e complete informações adicionais
7. Salve o veículo

## ⚠️ Limitações e Considerações

### Precisão da Extração

- A extração depende do formato do texto no PDF
- PDFs escaneados (imagens) não funcionarão (requerem OCR)
- Variações no layout do CRLV podem afetar a precisão
- Regex calibrado para padrão mais comum de CRLV brasileiro

### Validação Manual

- Sempre revise os dados preenchidos automaticamente
- Alguns campos podem não ser preenchidos se o padrão não for reconhecido
- Campos opcionais (chassi, renavam, versão) podem ficar vazios

### Segurança

- Validação de tamanho de arquivo (10MB max)
- Validação de tipo MIME (apenas PDF)
- Processamento server-side (não expõe dados sensíveis)
- Mutation protegida (apenas usuários autenticados)

## 📝 Exemplos de Dados Reais

Baseado em documento real testado:

```
Placa: EFK8177
RENAVAM: 01183536108
Chassi: 99ADJ78V7K4000189
Marca/Modelo: AUDI/A3 LM 150CV
Ano Fabricação: 2018
Ano Modelo: 2019
Cor: BRANCA
```

## 🔍 Troubleshooting

### "ReferenceError: DOMMatrix is not defined" ou "TypeError: parse is not a function"

**Causas:**

- pdf-parse v2 depende de APIs do navegador (DOMMatrix, Path2D, ImageData) que não existem no Node.js
- A v2 do pdf-parse usa a classe `PDFParse` ao invés de uma função direta

**Solução Implementada:**

- Instalamos `@napi-rs/canvas` que fornece os polyfills nativos necessários
- Usamos `await import("pdf-parse")` ao invés de `require()` para melhor compatibilidade com Turbopack
- Instanciamos a classe com `new PDFParse({ data: buffer })` e chamamos `getText()` e `getInfo()`

### "Erro ao processar o documento PDF"

- Verifique se o arquivo é um PDF válido
- Tente converter o PDF para outro formato e voltar para PDF
- Verifique se não é um PDF protegido/criptografado

### "Não foi possível extrair dados do documento"

- O PDF pode estar em formato de imagem (necessário OCR)
- O layout do CRLV pode ser diferente do padrão esperado
- Tente preencher manualmente os campos

### Campos não preenchidos

- Alguns CRLVs têm layouts diferentes
- Os regex podem precisar de ajustes para casos específicos
- Campos opcionais podem não existir no documento

## 🎯 Melhorias Futuras

1. **OCR Integration**: Suporte para PDFs escaneados usando Tesseract.js
2. **Machine Learning**: Treinar modelo para melhor extração de dados
3. **Preview**: Mostrar preview do documento antes do processamento
4. **Histórico**: Salvar histórico de documentos importados
5. **Validação Cruzada**: Validar dados extraídos com APIs de consulta de veículos (RENAVAM/DETRAN)
6. **Múltiplos Formatos**: Suporte para imagens (JPG, PNG) além de PDF
7. **Configuração de Regex**: Interface para administradores ajustarem padrões de extração

## 📄 Arquivos Modificados

### Backend

- `src/server/api/routers/veiculo.ts` - Nova mutation e função de parsing

### Frontend

- `src/app/(app)/veiculos/_components/VeiculoForm.tsx` - UI e lógica de upload

### Dependências

- `package.json` - pdf-parse@2.4.5, @napi-rs/canvas@0.1.80

---

**Data de Implementação**: Novembro 2025  
**Status**: ✅ Implementado e testado  
**Build Status**: ✅ Compilação bem-sucedida
