import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true, // Adiciona confiança para hosts locais
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        name: { label: "Nome", type: "text", placeholder: "Renê" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Validar se as credenciais foram fornecidas
        if (!credentials?.name || !credentials?.password) {
          return null;
        }
        
        // Verificar nome de usuário fixo e senha do env
        const validUsername = "admin"; // ou "Renê" se preferir
        
        if (credentials.name === validUsername && credentials.password === env.ADMIN_PASSWORD) {
          const user = { 
            id: "user_test_id", 
            name: credentials.name as string, 
            email: "admin@renoli.com" 
          };
          return user;
        }
        
        // Credenciais inválidas
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
      },
    }),
    authorized: ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/veiculos") || 
                           nextUrl.pathname.startsWith("/clientes") ||
                           nextUrl.pathname.startsWith("/dashboard");
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth");
      
      // Se está tentando acessar página protegida sem estar logado
      if (isOnDashboard && !isLoggedIn) {
        return false; // Redireciona para login
      }
      
      // Se está logado e tentando acessar página de auth, redireciona para home
      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      
      // Permitir acesso em outros casos
      return true;
    },
  },
} satisfies NextAuthConfig;
