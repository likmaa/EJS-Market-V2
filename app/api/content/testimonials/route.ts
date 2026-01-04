import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Liste publique des témoignages actifs
export async function GET() {
  await prisma.$connect().catch(() => { });
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

    return new Response(JSON.stringify({ testimonials }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    const errorInfo = {
      error: 'Query failed',
      message: err?.message || 'Unknown error',
      code: err?.code,
      meta: err?.meta
    };
    return new Response(JSON.stringify(errorInfo), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

