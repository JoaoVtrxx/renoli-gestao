-- CreateEnum
CREATE TYPE "public"."StatusVeiculo" AS ENUM ('DISPONIVEL', 'RESERVADO', 'VENDIDO');

-- CreateEnum
CREATE TYPE "public"."TipoTransacao" AS ENUM ('COMPRA', 'CONSIGNACAO', 'LOJA');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Profissao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Profissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EstadoCivil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "EstadoCivil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "celular" TEXT NOT NULL,
    "telefoneFixo" TEXT,
    "email" TEXT,
    "cep" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "aceitaMarketing" BOOLEAN NOT NULL DEFAULT true,
    "observacoesNegocios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profissaoId" TEXT,
    "estadoCivilId" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Veiculo" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "versao" TEXT,
    "anoFabricacao" INTEGER NOT NULL,
    "anoModelo" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "cambio" TEXT NOT NULL,
    "combustivel" TEXT NOT NULL,
    "portas" INTEGER NOT NULL,
    "chassi" TEXT,
    "renavam" TEXT,
    "tipo" TEXT,
    "localRegistro" TEXT,
    "precoCusto" DECIMAL(65,30),
    "precoVenda" DECIMAL(65,30) NOT NULL,
    "descricaoAnuncio" TEXT,
    "observacoesInternas" TEXT,
    "fotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "public"."StatusVeiculo" NOT NULL DEFAULT 'DISPONIVEL',
    "tipoTransacao" "public"."TipoTransacao" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteIdVendedor" TEXT NOT NULL,
    "clienteIdComprador" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Profissao_nome_key" ON "public"."Profissao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoCivil_nome_key" ON "public"."EstadoCivil"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "public"."Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "public"."Veiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_chassi_key" ON "public"."Veiculo"("chassi");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_renavam_key" ON "public"."Veiculo"("renavam");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_profissaoId_fkey" FOREIGN KEY ("profissaoId") REFERENCES "public"."Profissao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_estadoCivilId_fkey" FOREIGN KEY ("estadoCivilId") REFERENCES "public"."EstadoCivil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Veiculo" ADD CONSTRAINT "Veiculo_clienteIdVendedor_fkey" FOREIGN KEY ("clienteIdVendedor") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Veiculo" ADD CONSTRAINT "Veiculo_clienteIdComprador_fkey" FOREIGN KEY ("clienteIdComprador") REFERENCES "public"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Veiculo" ADD CONSTRAINT "Veiculo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
