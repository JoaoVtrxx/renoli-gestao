// Em: src/app/page.tsx

import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sistema <span className="text-[hsl(280,100%,70%)]">Renoli</span> Veículos
        </h1>
        
        {session?.user && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-2xl">
              Bem-vindo, {session.user.name}!
            </p>
            
            <Link
              href="/veiculos/novo"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Cadastrar Novo Veículo
            </Link>
          </div>
        )}
        
        {!session?.user && (
           <Link
              href="/api/auth/signin"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Fazer Login
            </Link>
        )}
      </div>
    </main>
  );
}