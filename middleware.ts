import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware simplifié : on laisse tout passer.
// La protection des routes admin/B2B est déjà gérée :
// - côté API avec `auth()` et les helpers de rôles
// - côté interface avec `useAuth` dans `AdminLayout`
export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

