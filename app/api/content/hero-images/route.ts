import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des images hero actives
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // "tech" ou "garden"

    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }

    const images = await prisma.hero_images.findMany({
      where,
      select: {
        id: true,
        type: true,
        name: true,
        mediaType: true,
        imageUrl: true,
        videoUrl: true,
        thumbnailUrl: true,
        price: true,
        available: true,
        order: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(
      { images },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des images hero:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

