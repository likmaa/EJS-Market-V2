import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        console.log('[Debug-DB] Testing connection...');
        await prisma.$connect();

        const userCount = await prisma.users.count();

        return NextResponse.json({
            status: 'success',
            message: 'Connected to database!',
            database: 'Neon/PostgreSQL',
            userCount,
            env: {
                DATABASE_URL_SET: !!process.env.DATABASE_URL,
                DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
                NODE_ENV: process.env.NODE_ENV,
            }
        });
    } catch (error: any) {
        console.error('[Debug-DB] Connection failed:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack,
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
