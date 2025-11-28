import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth-config';
import { getUserPermissions } from '@/lib/auth';

const DEFAULT_TEXT =
  'Livraison Gratuite en Europe dès 100€ ⚡️ Nouveaux Robots Husqvarna en stock ⚡️ -10% sur Apple avec le code EJS10 ⚡️';

export async function GET() {
  try {
    const settings = await prisma.site_settings.findUnique({
      where: { id: 'global' },
    });

    return NextResponse.json({
      newsBarText: settings?.newsBarText || DEFAULT_TEXT,
    });
  } catch (error) {
    console.error('[NewsBar] Erreur lors du chargement des paramètres:', error);
    return NextResponse.json(
      { newsBarText: DEFAULT_TEXT },
      { status: 200 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const permissions = getUserPermissions(session.user.role);
    if (!permissions.canManageSettings) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await req.json();
    const text = (body?.newsBarText ?? '').toString().trim();

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: 'Le texte de la NewsBar est trop court' },
        { status: 400 },
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Le texte de la NewsBar est trop long (max 500 caractères)' },
        { status: 400 },
      );
    }

    const settings = await prisma.site_settings.upsert({
      where: { id: 'global' },
      update: { newsBarText: text },
      create: {
        id: 'global',
        newsBarText: text,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      newsBarText: settings.newsBarText,
    });
  } catch (error) {
    console.error('[NewsBar] Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du texte de la NewsBar' },
      { status: 500 },
    );
  }
}


