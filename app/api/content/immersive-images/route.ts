import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des images immersives actives
export async function GET() {
  await prisma.$connect().catch(() => { });
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

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des images immersives:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur',
      message: error.message,
      code: error.code
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

