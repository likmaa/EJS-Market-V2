import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des partenaires actifs
export async function GET() {
  try {
    const partners = await prisma.partners.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        logoPath: true,
        cdnUrl: true,
        width: true,
        height: true,
        alt: true,
        order: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(
      { partners },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

