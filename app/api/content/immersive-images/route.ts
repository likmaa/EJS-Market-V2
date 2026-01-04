import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const images = await prisma.immersive_images.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('API ERROR [Immersive]:', err);
    return new Response(`CRITICAL ERROR: ${err.message}\nCODE: ${err.code}\nSTACK: ${err.stack}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  } finally {
    await prisma.$disconnect();
  }
}
