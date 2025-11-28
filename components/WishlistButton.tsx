'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice, calculateTTC } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  sku: string;
  name: string;
  priceHT: number;
  vatRate: number;
  image?: string;
  brand?: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function WishlistButton({
  productId,
  sku,
  name,
  priceHT,
  vatRate,
  image,
  brand,
  variant = 'icon',
  className = '',
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId,
      sku,
      name,
      priceHT,
      vatRate,
      image,
      brand,
    });
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        aria-label={inWishlist ? `Retirer ${name} de la liste de souhaits` : `Ajouter ${name} à la liste de souhaits`}
        className={`p-2 rounded-full transition-colors ${
          inWishlist
            ? 'bg-violet-electric text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        } ${className}`}
      >
        <svg
          className="w-5 h-5"
          fill={inWishlist ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        inWishlist
          ? 'bg-violet-electric text-white'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      } ${className}`}
      aria-label={inWishlist ? `Retirer ${name} de la liste de souhaits` : `Ajouter ${name} à la liste de souhaits`}
    >
      <svg
        className="w-5 h-5"
        fill={inWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{inWishlist ? 'Dans la liste' : 'Ajouter à la liste'}</span>
    </button>
  );
}

