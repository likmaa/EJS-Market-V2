import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = { isActive: true };
    if (type) where.type = type;

    await prisma.$connect();
    const images = await prisma.hero_images.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('API ERROR [Hero]:', err);
    return new Response(`CRITICAL ERROR: ${err.message}\nCODE: ${err.code}\nSTACK: ${err.stack}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  } finally {
    await prisma.$disconnect();
  }
}
