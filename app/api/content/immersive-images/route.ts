import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await prisma.immersive_images.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error('API ERROR [Immersive]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
