import { NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return NextResponse.json({
                error: 'Variables ADMIN_EMAIL ou ADMIN_PASSWORD manquantes dans Coolify',
                tip: 'Ajoutez-les dans les variables d\'environnement de votre application Coolify, faites un redeploy, puis revenez ici.'
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
            message: `L'utilisateur ${adminEmail} a été configuré avec succès dans la base de données de production.`,
            role: user.role,
            action: 'Vous pouvez maintenant essayer de vous connecter sur /login'
        });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Erreur lors de la configuration de l\'admin',
            details: error.message
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
