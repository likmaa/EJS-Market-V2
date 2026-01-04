import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des images hero actives
export async function GET(request: NextRequest) {
  await prisma.$connect().catch(() => { });
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

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des images hero:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur',
      message: error.message,
      code: error.code
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

