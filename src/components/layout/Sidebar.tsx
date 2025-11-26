"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      href: "/",
      label: "Início",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/veiculos",
      label: "Veículos",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: "/configuracoes",
      label: "Configurações",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 h-screen bg-sidebar text-white flex flex-col">
      {/* Header/Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="block">
          <h1 className="text-2xl font-display font-bold text-white">
            Sistema Renoli
          </h1>
          <p className="text-base text-white/70 font-display mt-1">
            Gestão de Veículos
          </p>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-5 py-4 rounded-lg transition-colors duration-200 font-display text-base min-h-[56px]
                  ${
                    isActiveLink(item.href)
                      ? "bg-primary/20 text-white border-r-2 border-primary"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <span className="mr-4 flex-shrink-0">
                  {item.icon}
                </span>
                <span className="font-semibold">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer/User Section */}
      <div className="p-4 border-t border-white/10">
        {session?.user ? (
          <div className="flex items-center px-4 py-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3 overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Avatar"}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-white font-display truncate">
                {session.user.name ?? "Usuário"}
              </p>
              <p className="text-sm text-white/70 font-display">
                Online
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="ml-2 p-2 text-white/70 hover:text-white transition-colors"
              title="Sair"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="px-4 py-2">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white font-display">
                  Visitante
                </p>
                <p className="text-sm text-white/70 font-display">
                  Offline
                </p>
              </div>
            </div>
            <Link
              href="/api/auth/signin"
              className="block w-full text-center px-4 py-3 bg-primary/20 hover:bg-primary/30 text-white text-base font-semibold rounded-lg transition-colors"
            >
              Fazer Login
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}