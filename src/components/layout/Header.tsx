"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">
              {session?.user?.name ? `Olá, ${session.user.name}!` : 'Olá!'}
            </span>
            
            <button 
              onClick={() => signOut()}
              className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/30 transition-colors"
            >
              Sair
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Avatar do usuário"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
