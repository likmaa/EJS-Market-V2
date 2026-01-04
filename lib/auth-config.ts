import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('[NextAuth] Email ou mot de passe manquant');
          return null;
        }

        const prisma = new PrismaClient();
        try {
          console.log('[NextAuth] Tentative login:', credentials.email);
          await prisma.$connect();

          const user = await prisma.users.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.error('[NextAuth] Utilisateur introuvable:', credentials.email);
            return null;
          }

          if (!user.passwordHash) {
            console.error('[NextAuth] Pas de mot de passe défini:', user.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.error('[NextAuth] Mot de passe invalide pour:', user.email);
            return null;
          }

          console.log('[NextAuth] Login réussi:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error('[NextAuth] ERREUR FATALE:', error.message);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {
        // Fallback si URL invalide
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXT_AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  debug: true, // Activé temporairement pour voir les logs dans Coolify
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions as any);
