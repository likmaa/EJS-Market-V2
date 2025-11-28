import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userCount = await prisma.users.count();
    const adminUser = await prisma.users.findUnique({
      where: { email: 'admin@ejsmarket.com' },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ 
      success: true, 
      userCount,
      adminExists: !!adminUser,
      adminUser: adminUser || null,
      databaseUrl: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 
        'not set'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}


