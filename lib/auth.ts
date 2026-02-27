import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { verificar_usuario_permitido } from "@/server/db/usuarios_sistema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    signIn: async ({ user }) => {
      // Check if user email is whitelisted in usuarios_sistema
      if (!user.email) {
        return false;
      }

      try {
        const es_permitido = await verificar_usuario_permitido(user.email);

        if (!es_permitido) {
          return "/auth/error?error=AccessDenied";
        }

        return true;
      } catch (error) {
        console.error("Error checking whitelist:", error);
        return false;
      }
    },
    authorized: async ({ auth, request: { nextUrl } }) => {
      const is_logged_in = !!auth?.user;
      const is_admin_route = nextUrl.pathname.startsWith("/admin");

      // Only require auth for admin routes
      if (is_admin_route) return is_logged_in;

      // Allow all other routes
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.sub!;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});

// Helper function to check if user is authenticated
export const obtener_session_de_usuario = auth;
