import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';
import { canAccessAdmin, canAccessB2B } from '@/lib/auth';

// Routes protégées par rôle
const adminRoutes = ['/admin'];
const b2bRoutes = ['/b2b'];

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/',
  '/products',
  '/cart',
  '/checkout',
  '/login',
  '/register',
  '/api/auth',
  '/api/public',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Récupérer le token JWT depuis NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Vérifier si c'est une route admin
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Vérifier si c'est une route B2B
  const isB2BRoute = b2bRoutes.some((route) => pathname.startsWith(route));

  // Si pas de token, rediriger vers login
  if (!token) {
    if (isAdminRoute || isB2BRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const userRole = token.role as UserRole;

  // Vérifier l'accès aux routes admin
  if (isAdminRoute && !canAccessAdmin(userRole)) {
    const url = request.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  // Vérifier l'accès aux routes B2B
  if (isB2BRoute && !canAccessB2B(userRole)) {
    const url = request.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

