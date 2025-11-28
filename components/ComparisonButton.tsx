'use client';

import { useComparison } from '@/contexts/ComparisonContext';

interface ComparisonButtonProps {
  productId: string;
  sku: string;
  name: string;
  priceHT: number;
  vatRate: number;
  image?: string;
  brand?: string;
  attributes?: Record<string, string | number>;
  category?: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function ComparisonButton({
  productId,
  sku,
  name,
  priceHT,
  vatRate,
  image,
  brand,
  attributes,
  category,
  variant = 'icon',
  className = '',
}: ComparisonButtonProps) {
  const { isInComparison, addToComparison, removeFromComparison, canAddMore } = useComparison();
  const inComparison = isInComparison(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inComparison) {
      removeFromComparison(productId);
    } else {
      if (canAddMore) {
        addToComparison({
          productId,
          sku,
          name,
          priceHT,
          vatRate,
          image,
          brand,
          attributes,
          category,
        });
      } else {
        alert(`Vous ne pouvez comparer que 4 produits maximum. Veuillez retirer un produit de la comparaison.`);
      }
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={!inComparison && !canAddMore}
        aria-label={inComparison ? `Retirer ${name} de la comparaison` : `Ajouter ${name} à la comparaison`}
        className={`p-2 rounded-full transition-colors ${
          inComparison
            ? 'bg-violet-electric text-white'
            : !canAddMore
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        } ${className}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inComparison && !canAddMore}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        inComparison
          ? 'bg-violet-electric text-white'
          : !canAddMore
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      } ${className}`}
      aria-label={inComparison ? `Retirer ${name} de la comparaison` : `Ajouter ${name} à la comparaison`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
      <span>{inComparison ? 'Dans la comparaison' : canAddMore ? 'Comparer' : 'Limite atteinte'}</span>
    </button>
  );
}

