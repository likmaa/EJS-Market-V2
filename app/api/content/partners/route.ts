import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const partners = await prisma.partners.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ partners });
  } catch (err: any) {
    console.error('API ERROR [Partners]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
