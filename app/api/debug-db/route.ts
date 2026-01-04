import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        console.log('[Debug-DB] Testing connection...');
        await prisma.$connect();

        const userCount = await prisma.users.count();
        const testimonialsCount = await prisma.testimonials.count();
        const partnersCount = await prisma.partners.count();
        const heroCount = await prisma.hero_images.count();
        const immersiveCount = await prisma.immersive_images.count();
        const settingsCount = await prisma.site_settings.count();

        const sampleTestimonial = await prisma.testimonials.findFirst();
        const samplePartner = await prisma.partners.findFirst();
        const sampleHero = await prisma.hero_images.findFirst();

        return NextResponse.json({
            status: 'success',
            message: 'Connected to database!',
            counts: {
                users: userCount,
                testimonials: testimonialsCount,
                partners: partnersCount,
                hero_images: heroCount,
                immersive_images: immersiveCount,
                site_settings: settingsCount,
            },
            samples: {
                testimonial: sampleTestimonial,
                partner: samplePartner,
                hero: sampleHero,
            },
            env: {
                DATABASE_URL_SET: !!process.env.DATABASE_URL,
                NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
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
