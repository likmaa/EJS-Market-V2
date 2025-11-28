import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { canAccessAdmin } from '@/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.record(z.string()), // JSON { fr: "...", en: "..." }
  description: z.record(z.string()).optional(),
  priceHT: z.number().int().positive(),
  defaultVATRate: z.number().min(0).max(1),
  weight: z.number().positive(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  stock: z.number().int().min(0),
  brand: z.string().min(1),
  category: z.string(),
  images: z.array(z.string().url()),
  attributes: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

// GET - Liste des produits
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const stockFilter = searchParams.get('stock');
    const search = searchParams.get('search');
    const active = searchParams.get('active');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort') || 'updated_desc';

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (stockFilter === 'low') {
      where.stock = { lt: 5 };
    } else if (stockFilter === 'out') {
      where.stock = 0;
    }

    if (active === 'active') {
      where.isActive = true;
    } else if (active === 'inactive') {
      where.isActive = false;
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { name: { path: ['fr'], string_contains: search } },
      ];
    }

    let orderBy: any = { updatedAt: 'desc' };

    if (sort === 'price_desc') {
      orderBy = { priceHT: 'desc' };
    } else if (sort === 'stock_asc') {
      orderBy = { stock: 'asc' };
    } else if (sort === 'best_sellers') {
      // Tri par meilleures ventes (quantité totale vendue)
      orderBy = {
        order_items: {
          _sum: {
            quantity: 'desc',
          },
        },
      };
    }

    const products = await (prisma as any).products.findMany({
      where,
      orderBy,
      take: 100,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un produit
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Vérifier si le SKU existe déjà
    const existingProduct = await (prisma as any).products.findUnique({
      where: { sku: validatedData.sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ce SKU existe déjà' },
        { status: 400 }
      );
    }

    const product = await (prisma as any).products.create({
      data: {
        ...validatedData,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

