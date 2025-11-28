import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

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

        try {
          console.log('[NextAuth] Tentative de connexion pour:', credentials.email);
          
          const user = await prisma.users.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          if (!user) {
            console.error('[NextAuth] Utilisateur introuvable:', credentials.email);
            return null;
          }

          console.log('[NextAuth] Utilisateur trouvé:', user.email, 'Rôle:', user.role);

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.error('[NextAuth] Mot de passe invalide pour:', credentials.email);
            return null;
          }

          console.log('[NextAuth] Authentification réussie pour:', credentials.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[NextAuth] Erreur lors de l\'authentification:', error);
          if (error instanceof Error) {
            console.error('[NextAuth] Message d\'erreur:', error.message);
            console.error('[NextAuth] Stack:', error.stack);
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Si l'URL de redirection est relative, la rendre absolue
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Si l'URL est sur le même domaine, l'utiliser
      if (new URL(url).origin === baseUrl) return url;
      // Sinon, rediriger vers la base
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions as any);

