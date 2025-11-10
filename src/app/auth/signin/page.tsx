"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image"; 
import { Input, Label, Button, Card } from "~/components/ui";
import { usePageTitle } from "~/hooks/usePageTitle";

function SignInForm() {
  usePageTitle("Login");
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!name.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const result = await signIn("credentials", {
        name: name.trim(),
        password: password,
        callbackUrl,
        redirect: false, // Para capturar erros
      });
      
      if (result?.error) {
        setErrorMessage("Credenciais inválidas. Verifique seu nome de usuário e senha.");
      } else if (result?.ok) {
        // Redirecionar manualmente se o login foi bem-sucedido
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Erro interno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-md">
        {/* Logo da Renoli */}
        <div className="text-center mb-6">
          <div className="w-48 h-32 mx-auto mb-4 flex items-center justify-center">
            
            <Image
              src="/logo.jpg"
              alt="Renoli Veículos"
              width={192}
              height={128}
              className="object-contain"
              priority
            />
           
          </div>
          <h1 className="text-2xl font-bold text-foreground">Renoli Veículos</h1>
          <p className="text-muted-foreground mt-2">Acesso ao Sistema</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo Nome de Usuário */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome de Usuário</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Digite seu nome de usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {errorMessage}
            </div>
          )}

          {/* Botão de Submissão */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading || !name.trim() || !password.trim()}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignInForm />
    </Suspense>
  );
}