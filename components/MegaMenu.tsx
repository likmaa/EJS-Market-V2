'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface MegaMenuProps {
  onClose: () => void;
}

export function MegaMenu({ onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Désactiver les clics pendant un court instant après l'ouverture
    let isOpening = true;
    const openingTimeout = setTimeout(() => {
      isOpening = false;
    }, 300);

    const handleClickOutside = (event: MouseEvent) => {
      // Ignorer les clics pendant l'ouverture
      if (isOpening) {
        return;
      }

      const target = event.target as Node;
      
      // Ne pas fermer si le clic est dans le menu
      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }
      
      // Ne pas fermer si le clic est dans le header (y compris le bouton Explorer)
      const header = document.querySelector('header');
      if (header && header.contains(target)) {
        return;
      }
      
      // Fermer si le clic est vraiment en dehors
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Attendre un peu avant d'ajouter l'écouteur
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 300);

    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(openingTimeout);
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const categories = [
    {
      title: 'Apple & Mobile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      items: [
        { name: 'iPhone & Smartphones', href: '/products?category=electronics&brand=Apple&type=smartphone' },
        { name: 'MacBook & iMac', href: '/products?category=electronics&brand=Apple&type=laptop' },
        { name: 'iPad & Tablettes', href: '/products?category=electronics&brand=Apple&type=tablet' },
        { name: 'Apple Watch & Accessoires', href: '/products?category=electronics&brand=Apple&type=watch' },
      ],
    },
    {
      title: 'Gaming & Image',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      items: [
        { name: 'Consoles (PS5) & VR', href: '/products?category=electronics&type=gaming' },
        { name: 'PC Gaming & Écrans', href: '/products?category=electronics&type=pc' },
        { name: 'Photo (Sony, Canon) & Drones', href: '/products?category=photo' },
      ],
    },
    {
      title: 'E-Mobilité',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      items: [
        { name: 'Trottinettes Électriques', href: '/products?category=mobility&type=scooter' },
        { name: 'Hoverboards & Gyropodes', href: '/products?category=mobility&type=hoverboard' },
        { name: 'Skateboards Électriques', href: '/products?category=mobility&type=skateboard' },
      ],
    },
    {
      title: 'Jardin Tech',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      items: [
        { name: 'Robots Tondeuses (Husqvarna...)', href: '/products?category=garden&type=mower' },
        { name: 'Arrosage Connecté', href: '/products?category=garden&type=irrigation' },
        { name: 'Outils Motorisés & Main', href: '/products?category=tools' },
        { name: 'Robots Culinaires (Thermomix)', href: '/products?category=electronics&type=kitchen' },
      ],
    },
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-[60] w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
          {/* 4 Colonnes de catégories */}
          {categories.map((category, index) => (
            <div key={index}>
              <h3 className="font-bold text-black-deep mb-4 text-lg flex items-center gap-2">
                <span className="text-violet-electric">{category.icon}</span>
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="text-gray-600 hover:text-violet-electric transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Colonne 5 : En Vedette (Image) */}
          <div className="hidden lg:block">
            <h3 className="font-bold text-black-deep mb-4 text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              En Vedette
            </h3>
            <Link href="/products/apple-vision-pro" onClick={onClose} className="block group">
              <div className="relative h-64 bg-gray-soft rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-violet-electric/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-black-deep group-hover:text-violet-electric transition-colors">
                      Apple Vision Pro
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Découvrir</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

