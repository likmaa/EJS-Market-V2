import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des partenaires actifs
export async function GET() {
  await prisma.$connect().catch(() => { });
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

    return new Response(JSON.stringify({ partners }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des partenaires:', error);
    return new Response(JSON.stringify({
      error: 'Erreur serveur',
      message: error.message,
      code: error.code
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
