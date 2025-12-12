
# Manual Técnico de Instalação e Desenvolvimento - Renoli Gestão

Este README detalha o processo de instalação, configuração de ambiente e manutenção do projeto **Renoli Gestão**. O sistema é uma aplicação web Full-Stack moderna focada em performance e acessibilidade.

---

## 1. Stack Tecnológica

O projeto utiliza a **T3 Stack** (modificada) com as seguintes tecnologias principais:

- **Framework:** Next.js 15 (App Router + Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 (Utility-first)
- **API/Data Fetching:** tRPC (Type-safe client-server communication)
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL (Hospedado no Supabase ou Neon)
- **Auth:** NextAuth.js v5 (Auth.js)
- **File Storage:** Supabase Storage
- **Manipulação de Arquivos:**
  - `pdfjs-dist` (Legacy Build): Parsing de CRLV Digital.
  - `docx`: Geração de contratos de compra e venda.

---

## 2. Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js:** Versão 20.x ou superior (Recomendado para Next.js 15).
- **Gerenciador de Pacotes:** `npm` (padrão utilizado) ou `pnpm`.
- **Banco de Dados:** Uma string de conexão válida para um banco PostgreSQL.

---

## 3. Configuração do Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto copiando o `.env.example`. As variáveis obrigatórias são:

```ini
# Banco de Dados (Prisma)
DATABASE_URL="postgresql://user:password@host:port/db_name?schema=public"

# Autenticação (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui" # Gere com: openssl rand -base64 32

# Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL="[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_publica"
SUPABASE_SERVICE_ROLE_KEY="sua_chave_privada_para_upload"
````

-----

## 4\. Instalação e Execução Local

Siga os passos abaixo para levantar o ambiente de desenvolvimento:

1.  **Clonar o repositório:**

    ```bash
    git clone [https://github.com/JoaoVtrxx/renoli-gestao.git](https://github.com/JoaoVtrxx/renoli-gestao.git)
    cd renoli-gestao
    ```

2.  **Instalar dependências:**

    ```bash
    npm install
    ```

    > **Nota Crítica:** Certifique-se de que o `pdfjs-dist` está instalado na versão correta (Legacy) para suportar a feature de leitura de CRLV.

3.  **Sincronizar Banco de Dados:**

    ```bash
    npx prisma generate   # Gera o cliente Prisma
    npx prisma db push    # Sincroniza o schema com o banco (Dev)
    ```

4.  **Rodar o Servidor:**

    ```bash
    npm run dev
    ```

    O projeto estará rodando em `http://localhost:3000`.

-----

## 5\. Arquitetura e Módulos Críticos

### A. Parsing de PDF (CRLV Digital)

Esta funcionalidade permite ler o PDF do documento do veículo. Devido a limitações do ambiente Serverless (Vercel) e conflitos com ESM/Windows, a implementação segue regras estritas:

  - **Arquivo:** `src/server/api/routers/veiculo.ts`
  - **Estratégia:** "No-Worker" + Polyfill Preventivo.
  - **Configuração:**
      - O worker do PDF.js é desabilitado (`disableWorker: true`) para rodar na thread principal.
      - O caminho do worker é resolvido via `require.resolve` para forçar o empacotamento na Vercel.
      - Um Polyfill de `DOMMatrix` é injetado manualmente se o ambiente não tiver.

**Snippet de Configuração Crítica:**

```typescript
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
try {
  // Força inclusão do arquivo no bundle
  pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.js');
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}
```

### B. Geração de Contratos (.docx)

Utiliza a biblioteca `docx` para criar arquivos binários no backend.

  - **Formatação:** Utiliza unidades "Twips" e "Half-points" para tamanhos (ex: `size: 24` = 12pt).
  - **Lógica:** A função `generateContract` busca dados relacionais (Vendedor/Comprador) e preenche placeholders ou cria linhas "\_\_\_\_\_\_\_\_\_\_" se o dado for nulo.

### C. Acessibilidade (Frontend)

O projeto utiliza Tailwind CSS v4. Componentes base (`src/components/ui`) foram refatorados para garantir alvos de toque mínimos de 48px e fontes base de 18px (`text-base` ou `text-lg`) para atender usuários idosos.

-----

## 6\. Deploy na Vercel

Para colocar em produção, atenção especial ao `next.config.ts` para garantir que as bibliotecas binárias sejam copiadas corretamente.

**Configuração Obrigatória (`next.config.ts`):**

```typescript
const nextConfig = {
  // Impede que o Next.js tente otimizar/remover arquivos críticos do PDF.js
  serverExternalPackages: ['pdfjs-dist'],
};
```

**Comandos de Build:**
A Vercel executa automaticamente:

1.  `npm install`
2.  `npx prisma generate` (definido no `postinstall` script do package.json recomendado)
3.  `npm run build`


-----

