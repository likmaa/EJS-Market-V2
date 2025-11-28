import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des témoignages actifs
export async function GET() {
  try {
    const testimonials = await prisma.testimonials.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        initial: true,
        rating: true,
        text: true,
        product: true,
        date: true,
        order: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(
      { testimonials },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

