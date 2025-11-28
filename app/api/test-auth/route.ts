import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'set (' + process.env.NEXTAUTH_SECRET.length + ' chars)' : 'not set',
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'not set'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

