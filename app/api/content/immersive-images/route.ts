import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des images immersives actives
export async function GET() {
  try {
    const images = await prisma.immersive_images.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        mediaType: true,
        imageUrl: true,
        videoUrl: true,
        thumbnailUrl: true,
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
    console.error('Erreur lors de la récupération des images immersives:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

