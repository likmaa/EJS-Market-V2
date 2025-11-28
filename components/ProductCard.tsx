'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { WishlistButton } from './WishlistButton';
import { ComparisonButton } from './ComparisonButton';

interface ProductCardProps {
  id: string;
  sku: string;
  name: string;
  priceHT: number;
  vatRate: number;
  image?: string;
  brand: string;
  stock: number;
  isActive: boolean;
}

export const ProductCard = memo(function ProductCard({
  id,
  sku,
  name,
  priceHT,
  vatRate,
  image,
  brand,
  stock,
  isActive,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const priceTTC = priceHT * (1 + vatRate);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (stock > 0 && isActive) {
      addToCart({
        productId: id,
        sku,
        name,
        priceHT,
        vatRate,
        image,
      });
    }
  }, [id, sku, name, priceHT, vatRate, image, stock, isActive, addToCart]);

  return (
    <Link href={`/products/${id}`} aria-label={`Voir les détails de ${name}`}>
      <Card hover className="h-full flex flex-col group">
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
          {image ? (
            <Image
              src={image}
              alt={`${name} - ${brand}`}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={80}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-24 h-24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {stock === 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="error">Rupture de stock</Badge>
            </div>
          )}
          {!isActive && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning">Indisponible</Badge>
            </div>
          )}
          {/* Action buttons */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <WishlistButton
              productId={id}
              sku={sku}
              name={name}
              priceHT={priceHT}
              vatRate={vatRate}
              image={image}
              brand={brand}
              variant="icon"
            />
            <ComparisonButton
              productId={id}
              sku={sku}
              name={name}
              priceHT={priceHT}
              vatRate={vatRate}
              image={image}
              brand={brand}
              variant="icon"
            />
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <p className="text-sm text-gray-600 mb-1">{brand}</p>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-black-deep">{name}</h3>
          <p className="text-2xl font-bold text-violet-electric mb-2">
            {formatPrice(priceTTC)}
          </p>
          <p className="text-sm text-gray-600">
            HT: {formatPrice(priceHT)} (TVA incl.)
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleAddToCart}
            disabled={stock === 0 || !isActive}
            aria-label={stock > 0 ? `Ajouter ${name} au panier` : `${name} - Rupture de stock`}
          >
            {stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
});

