import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = { isActive: true };
    if (type) where.type = type;

    const images = await prisma.hero_images.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error('API ERROR [Hero]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
