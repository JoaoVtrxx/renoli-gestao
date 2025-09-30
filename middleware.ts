import NextAuth from "next-auth";
import { authConfig } from "~/server/auth/config";

/**
 * Middleware de autenticação usando NextAuth v5
 * Protege rotas automaticamente baseado na configuração do authConfig
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};