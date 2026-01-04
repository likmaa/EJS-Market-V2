import { NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const diagnostics = {
            ADMIN_EMAIL_SET: !!adminEmail,
            ADMIN_PASSWORD_SET: !!adminPassword,
            NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
            NODE_ENV: process.env.NODE_ENV,
        };

        if (!adminEmail || !adminPassword) {
            return NextResponse.json({
                error: 'Variables ADMIN_EMAIL ou ADMIN_PASSWORD manquantes',
                diagnostics
            }, { status: 400 });
        }

        await prisma.$connect();
        const passwordHash = await bcrypt.hash(adminPassword, 12);

        const user = await prisma.users.upsert({
            where: { email: adminEmail },
            update: {
                passwordHash,
                role: UserRole.ADMIN,
                isEmailVerified: true,
            },
            create: {
                id: crypto.randomUUID(),
                email: adminEmail,
                passwordHash,
                name: 'Administrateur',
                role: UserRole.ADMIN,
                isEmailVerified: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: `L'utilisateur ${adminEmail} a été configuré avec succès.`,
            diagnostics,
            action: 'Vérifiez que NEXTAUTH_SECRET est bien défini si les diagnostics indiquent FALSE.'
        });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Erreur',
            message: error.message
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
