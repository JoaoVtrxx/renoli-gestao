import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Renoli Gestão",
  description: "Sistema de gestão de veículos e clientes da Renoli",
  keywords: ["Renoli", "gestão", "veículos", "clientes", "sistema"],
  authors: [{ name: "Renoli" }],
  creator: "Renoli",
  publisher: "Renoli",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "apple-touch-icon", url: "/favicon.svg" }
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
