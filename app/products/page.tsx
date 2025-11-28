'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import dynamic from 'next/dynamic';
import { Toast } from '@/components/Toast';

// Lazy load les composants mobile pour améliorer les performances
const MobileProductCard = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileProductCard })), {
  ssr: false,
});

const MobileFiltersButton = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileFiltersButton })), {
  ssr: false,
});

const MobileFiltersModal = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileFiltersModal })), {
  ssr: false,
});

const PullToRefresh = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.PullToRefresh })), {
  ssr: false,
});

// Lazy load le modal pour améliorer les performances
const ProductDetailModal = dynamic(() => import('@/components/ProductDetailModal').then(mod => ({ default: mod.ProductDetailModal })), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>,
  ssr: false,
});
import { useCart } from '@/contexts/CartContext';
import { calculateTTC } from '@/lib/utils';

// Liste étendue de produits mockés, bien catégorisés
const mockProducts = [
  // Électronique - Apple
  { id: '1', name: 'iPhone 15 Pro', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', price: 1199 },
  { id: '2', name: 'iPhone 15 Pro Max', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', price: 1399 },
  { id: '3', name: 'MacBook Pro M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', price: 1999 },
  { id: '4', name: 'MacBook Air M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', price: 1299 },
  { id: '5', name: 'iPad Pro 12.9"', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', price: 1099 },
  { id: '6', name: 'Apple Watch Ultra 2', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500', price: 899 },
  { id: '7', name: 'AirPods Pro 2', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500', price: 279 },
  { id: '8', name: 'iMac 24" M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', price: 1499 },
  
  // Électronique - Gaming
  { id: '9', name: 'PlayStation 5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', price: 499 },
  { id: '10', name: 'Xbox Series X', creator: 'Microsoft', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', price: 499 },
  { id: '11', name: 'Nintendo Switch OLED', creator: 'Nintendo', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500', price: 349 },
  { id: '12', name: 'Steam Deck', creator: 'Valve', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=500', price: 549 },
  
  // Photo & Vidéo
  { id: '13', name: 'Sony Alpha 7 IV', creator: 'Sony', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 2799 },
  { id: '14', name: 'Canon EOS R5', creator: 'Canon', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 3899 },
  { id: '15', name: 'DJI Mavic 3 Pro', creator: 'DJI', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500', price: 2199 },
  { id: '16', name: 'GoPro Hero 12', creator: 'GoPro', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=500', price: 449 },
  { id: '17', name: 'Sony FX3 Cinema Camera', creator: 'Sony', category: 'photo', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 3999 },
  
  // Jardinage
  { id: '18', name: 'Robot Tondeuse Automower 430X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 2499 },
  { id: '19', name: 'Tondeuse Robot Gardena', creator: 'Gardena', category: 'garden', categoryLabel: 'Univers Jardin', image: '/jard2.jpg', price: 899 },
  { id: '20', name: 'Tronçonneuse STIHL MS 271', creator: 'STIHL', category: 'garden', categoryLabel: 'Univers Jardin', image: '/jard3.jpg', price: 349 },
  { id: '21', name: 'Tondeuse Robot Worx Landroid', creator: 'Worx', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 1299 },
  { id: '22', name: 'Aspirateur Souffleur STIHL', creator: 'STIHL', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 199 },
  { id: '23', name: 'Taille-haie Électrique Bosch', creator: 'Bosch', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 149 },
  { id: '24', name: 'Système d\'Arrosage Connecté Gardena', creator: 'Gardena', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 299 },
  { id: '25', name: 'Robot Tondeuse Automower 315X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 1799 },
  
  // Mobilité
  { id: '26', name: 'Trottinette Électrique Xiaomi Pro 2', creator: 'Xiaomi', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 399 },
  { id: '27', name: 'Trottinette Électrique Segway Ninebot', creator: 'Segway', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 599 },
  { id: '28', name: 'Hoverboard Smart Balance', creator: 'Smart Balance', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 249 },
  { id: '29', name: 'Vélo Électrique Trek', creator: 'Trek', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 2499 },
  { id: '30', name: 'Skateboard Électrique Boosted', creator: 'Boosted', category: 'mobility', categoryLabel: 'E-Mobilité', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', price: 1299 },
  
  // Outils
  { id: '31', name: 'Perceuse Visseuse Sans Fil Bosch', creator: 'Bosch', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 129 },
  { id: '32', name: 'Scie Circulaire Makita', creator: 'Makita', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 199 },
  { id: '33', name: 'Ponceuse Excentrique Festool', creator: 'Festool', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 449 },
  { id: '34', name: 'Meuleuse d\'Angle DeWalt', creator: 'DeWalt', category: 'tools', categoryLabel: 'Outils', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', price: 179 },
  
  // Électronique - Autres
  { id: '35', name: 'Aspirateur Robot Roomba i7+', creator: 'iRobot', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', price: 599 },
  { id: '36', name: 'Enceinte Sonos Era 300', creator: 'Sonos', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', price: 449 },
  { id: '37', name: 'Écran Gaming Samsung Odyssey', creator: 'Samsung', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', price: 799 },
  { id: '38', name: 'Casque Sony WH-1000XM5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', price: 399 },
];

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const { addToCart, itemsCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{ name: string; image: string; quantity: number } | null>(null);
  
  // États pour les filtres avancés
  const [openDropdown, setOpenDropdown] = useState<'category' | 'brand' | 'price' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  
  // État pour le modal de filtres mobile
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Références pour fermer les dropdowns au clic extérieur
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  
  // Options de filtres
  const categoryOptions = [
    { 
      id: 'electronics', 
      label: 'Électronique', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'garden', 
      label: 'Jardinage', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      id: 'photo', 
      label: 'Photo & Vidéo', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'mobility', 
      label: 'E-Mobilité', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: 'tools', 
      label: 'Outils', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];
  
  // Extraire toutes les marques uniques des produits
  const allBrands = useMemo(() => {
    const brands = new Set(mockProducts.map(p => p.creator));
    return Array.from(brands).sort().map(brand => ({
      id: brand.toLowerCase().replace(/\s+/g, '-'),
      label: brand,
    }));
  }, []);
  
  // Calcul du nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange.min > 0 || priceRange.max < 5000) count += 1;
    return count;
  }, [selectedCategories, selectedBrands, priceRange]);
  
  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (categoryDropdownRef.current && categoryDropdownRef.current.contains(target)) return;
      if (brandDropdownRef.current && brandDropdownRef.current.contains(target)) return;
      if (priceDropdownRef.current && priceDropdownRef.current.contains(target)) return;
      
      setOpenDropdown(null);
    };
    
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);
  
  // Fonctions de gestion des filtres
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 5000 });
    setOpenDropdown(null);
  };
  
  const removeFilter = (type: 'category' | 'brand' | 'price', id?: string) => {
    if (type === 'category' && id) {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    } else if (type === 'brand' && id) {
      setSelectedBrands((prev) => prev.filter((brandId) => brandId !== id));
    } else if (type === 'price') {
      setPriceRange({ min: 0, max: 5000 });
    }
  };
  
  // États pour la section immersive 3D
  const [currentImmersiveIndex, setCurrentImmersiveIndex] = useState(0);
  const immersiveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Motion values pour l'effet 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations pour les valeurs de la souris
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  
  // Transform pour la rotation 3D
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  
  // Transform pour la position de l'effet de lumière (glow) en pourcentage
  const glowXPercent = useTransform(smoothX, [-0.5, 0.5], [20, 80]);
  const glowYPercent = useTransform(smoothY, [-0.5, 0.5], [20, 80]);
  
  // Images immersives (produits tech uniquement)
  const immersiveImages = useMemo(() => [
    { 
      id: 1, 
      url: '/img1.jpg', 
      name: 'iPhone 15 Pro Max',
    },
    { 
      id: 2, 
      url: '/img2.jpg', 
      name: 'MacBook Pro M3',
    },
    { 
      id: 3, 
      url: '/img3.jpg', 
      name: 'PlayStation 5',
    },
  ], []);
  
  // Gestion du mouvement de la souris pour l'effet 3D
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);
  
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);
  
  // Auto-play pour la section immersive - change toutes les 11 secondes
  useEffect(() => {
    if (immersiveIntervalRef.current) {
      clearInterval(immersiveIntervalRef.current);
    }
    
    immersiveIntervalRef.current = setInterval(() => {
      setCurrentImmersiveIndex((prev) => (prev + 1) % immersiveImages.length);
    }, 11000); // 11 secondes
    
    return () => {
      if (immersiveIntervalRef.current) {
        clearInterval(immersiveIntervalRef.current);
      }
    };
  }, [immersiveImages.length]);

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Filtre par catégories (multiple)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // Filtre par marques (multiple)
    if (selectedBrands.length > 0) {
      const brandNames = selectedBrands.map(id => 
        allBrands.find(b => b.id === id)?.label
      ).filter(Boolean) as string[];
      filtered = filtered.filter((p) => brandNames.includes(p.creator));
    }

    // Filtre par plage de prix
    filtered = filtered.filter((p) => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [selectedCategories, selectedBrands, priceRange, sortBy, allBrands]);

  // Fonction pour obtenir les détails complets d'un produit (mock - à remplacer par API)
  const getProductDetails = useCallback((productId: string) => {
    // Mapping simple pour les produits de base vers le format détaillé
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      // Fallback si produit non trouvé
      return {
        id: productId,
        sku: `SKU-${productId}`,
        name: 'Produit',
        creator: 'Marque',
        description: { fr: 'Description du produit', en: '' },
        priceHT: 0,
        vatRate: 0.20,
        brand: 'Marque',
        category: 'electronics',
        categoryLabel: 'Univers Tech',
        stock: 0,
        isActive: true,
        images: [],
        attributes: {},
        features: [],
      };
    }

    // Données mockées pour les détails (à remplacer par API)
    const detailsMap: Record<string, any> = {
      '1': {
        id: '1',
        sku: 'APP-IPH-0001',
        name: 'iPhone 15 Pro',
        creator: 'Apple',
        description: { fr: 'Le dernier iPhone avec puce A17 Pro révolutionnaire, écran Super Retina XDR de 6,1 pouces avec ProMotion, et système de caméra Pro avancé avec zoom optique 3x.', en: '' },
        priceHT: 119900,
        vatRate: 0.20,
        brand: 'Apple',
        category: 'electronics',
        categoryLabel: 'Univers Tech',
        stock: 10,
        isActive: true,
        images: [product.image, product.image, product.image],
        attributes: { processor: 'A17 Pro', ram: '8Go', storage: '256Go' },
        features: ['Puce A17 Pro', 'Écran Super Retina XDR', 'Système de caméra Pro'],
      },
      '9': {
        id: '9',
        sku: 'SON-PS5-0001',
        name: 'PlayStation 5',
        creator: 'Sony',
        description: { fr: 'Console de jeu nouvelle génération avec processeur AMD Ryzen Zen 2, GPU RDNA 2 personnalisé, et SSD ultra-rapide.', en: '' },
        priceHT: 49900,
        vatRate: 0.20,
        brand: 'Sony',
        category: 'electronics',
        categoryLabel: 'Univers Tech',
        stock: 5,
        isActive: true,
        images: [product.image, product.image],
        attributes: { processor: 'AMD Ryzen Zen 2', gpu: 'AMD RDNA 2', storage: '825Go SSD' },
        features: ['SSD ultra-rapide', 'Ray tracing', 'Support 4K 120fps'],
      },
      '18': {
        id: '18',
        sku: 'HUS-ROB-0001',
        name: 'Robot Tondeuse Automower 430X',
        creator: 'Husqvarna',
        description: { fr: 'Robot tondeuse intelligent avec navigation GPS, système de coupe automatique, et application mobile.', en: '' },
        priceHT: 249900,
        vatRate: 0.20,
        brand: 'Husqvarna',
        category: 'garden',
        categoryLabel: 'Univers Jardin',
        stock: 3,
        isActive: true,
        images: [product.image, product.image],
        attributes: { surface: 'Jusqu\'à 4000m²', navigation: 'GPS + Capteurs', batterie: 'Lithium-ion' },
        features: ['Navigation GPS précise', 'Application mobile', 'Fonctionne par tous les temps'],
      },
    };

    const details = detailsMap[productId];
    if (details) return details;

    // Fallback pour les autres produits
    return {
      id: product.id,
      sku: `SKU-${product.id}`,
      name: product.name,
      creator: product.creator,
      description: { fr: `Description de ${product.name}. Produit premium de qualité avec toutes les fonctionnalités modernes.`, en: '' },
      priceHT: product.price * 100,
      vatRate: 0.20,
      brand: product.creator,
      category: product.category,
      categoryLabel: product.categoryLabel,
      stock: 10,
      isActive: true,
      images: [product.image, product.image],
      attributes: { marque: product.creator, categorie: product.categoryLabel },
      features: [`Produit ${product.name} de qualité premium`, 'Livraison rapide', 'Garantie constructeur'],
    };
  }, []);

  const handleOpenModal = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: typeof mockProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const priceHT = product.price * 100;
    addToCart(
      {
        productId: product.id,
        sku: `SKU-${product.id}`,
        name: product.name,
        priceHT,
        vatRate: 0.20,
        image: product.image,
      },
      1
    );
    setLastAddedProduct({ name: product.name, image: product.image, quantity: 1 });
    setShowToast(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-4 md:py-8">
      <h1 className="text-5xl font-extrabold text-violet-electric mb-4">Boutique</h1>
      <p className="text-lg text-gray-600 mb-8">
        Découvrez notre sélection de produits premium pour l&apos;électronique et le jardinage intelligent
      </p>

      {/* Barre de filtres améliorée - Masquée sur mobile */}
      <div className="hidden lg:block bg-gray-soft rounded-xl px-6 py-4 mb-8 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Ligne principale avec boutons de filtres */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Dropdown Catégorie */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    openDropdown === 'category' || selectedCategories.length > 0
                      ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                  }`}
                >
            Catégorie
                  {selectedCategories.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {openDropdown === 'category' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[240px]"
                    >
                      <div className="space-y-1">
                        {categoryOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => toggleCategory(option.id)}
                            className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                              selectedCategories.includes(option.id)
                                ? 'bg-violet-electric/10 text-violet-electric font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex-shrink-0">{option.icon}</span>
                            <span className="flex-1">{option.label}</span>
                            {selectedCategories.includes(option.id) && (
                              <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown Marque */}
              <div className="relative" ref={brandDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'brand' ? null : 'brand')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    openDropdown === 'brand' || selectedBrands.length > 0
                      ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                  }`}
                >
                  Marque
                  {selectedBrands.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedBrands.length}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'brand' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {openDropdown === 'brand' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px] max-h-[300px] overflow-y-auto"
                    >
                      <div className="space-y-1">
                        {allBrands.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => toggleBrand(brand.id)}
                            className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                              selectedBrands.includes(brand.id)
                                ? 'bg-violet-electric/10 text-violet-electric font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex-1">{brand.label}</span>
                            {selectedBrands.includes(brand.id) && (
                              <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown Prix */}
              <div className="relative" ref={priceDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    openDropdown === 'price' || priceRange.min > 0 || priceRange.max < 5000
                      ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                  }`}
                >
                  Prix
                  {(priceRange.min > 0 || priceRange.max < 5000) && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'price' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {openDropdown === 'price' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[280px]"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix min: {priceRange.min}€
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="50"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix max: {priceRange.max}€
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="50"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {priceRange.min}€ - {priceRange.max}€
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
        </div>

        {/* Tri */}
              <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-violet-electric transition-all duration-200 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric"
                >
                  <option value="name">Trier: Nom (A-Z)</option>
                  <option value="price-asc">Trier: Prix croissant</option>
                  <option value="price-desc">Trier: Prix décroissant</option>
          </select>
        </div>
      </div>

            <div className="flex items-center gap-4">
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-violet-electric rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-sm font-bold">{activeFiltersCount}</span>
                </motion.div>
              )}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 bg-transparent text-gray-600 rounded-lg font-medium text-sm hover:bg-white/80 hover:text-violet-electric transition-all duration-200 flex items-center gap-2"
                >
                  Réinitialiser
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Tags des filtres actifs */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange.min > 0 || priceRange.max < 5000) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-300"
            >
              {selectedCategories.map((catId) => {
                const category = categoryOptions.find((c) => c.id === catId);
                return category ? (
                  <motion.button
                    key={catId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => removeFilter('category', catId)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                ) : null;
              })}
              {selectedBrands.map((brandId) => {
                const brand = allBrands.find((b) => b.id === brandId);
                return brand ? (
                  <motion.button
                    key={brandId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => removeFilter('brand', brandId)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                  >
                    <span>{brand.label}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                ) : null;
              })}
              {(priceRange.min > 0 || priceRange.max < 5000) && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => removeFilter('price')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                >
                  <span>Prix: {priceRange.min}€ - {priceRange.max}€</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bouton Filtres Mobile (flottant) */}
      <MobileFiltersButton
        onClick={() => setIsMobileFiltersOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Modal Filtres Mobile */}
      <MobileFiltersModal
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        onApply={(filters) => {
          setSelectedCategories(filters.categories);
          setSelectedBrands(filters.brands);
          setPriceRange(filters.priceRange);
        }}
        categoryOptions={categoryOptions}
        brandOptions={allBrands}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        priceRange={priceRange}
        maxPrice={5000}
      />

      {/* Liste produits avec le même style que la page d'accueil */}
      {filteredAndSortedProducts.length > 0 ? (
        <PullToRefresh
          onRefresh={async () => {
            // Simuler un rafraîchissement (à remplacer par un vrai appel API)
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Ici, on pourrait recharger les produits depuis l'API
          }}
          disabled={false}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-stretch">
          {filteredAndSortedProducts.map((product) => {
            return (
              <div key={product.id}>
                {/* Version Mobile */}
                <div className="lg:hidden">
                  <MobileProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    creator={product.creator}
                    category={product.categoryLabel}
                    onViewProduct={() => handleOpenModal(product)}
                  />
                </div>
                
                {/* Version Desktop */}
                <div className="hidden lg:block">
                <Card hover className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm group relative">
                <div className="h-80 bg-gray-soft rounded-t-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <CardContent className="p-7 flex-1 flex flex-col justify-between min-h-[300px] bg-off-white">
                  {/* Section 1: Category + Title */}
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <p className="text-xs text-gray-400 mb-2 font-normal">{product.categoryLabel}</p>
                    <h3 className="font-bold text-black-deep text-xl leading-snug">{product.name}</h3>
                  </div>
                  
                  {/* Section 2: By Creator + Price */}
                  <div className="border-b border-gray-200 pb-3 mb-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm text-gray-500 font-normal">By </span>
                      <span className="text-sm text-black-deep font-medium">{product.creator}</span>
                    </div>
                    <div className="text-right flex items-baseline">
                      <span className="text-sm text-black-deep font-normal">from </span>
                      <span className="text-4xl font-bold text-black-deep ml-1">{Math.floor(product.price)}</span>
                      <span className="text-sm text-black-deep font-normal ml-1"> €</span>
                    </div>
                  </div>
                  
                  {/* Section 3: Actions */}
                  <div className="pt-1 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenModal(product);
                      }}
                      className="text-sm text-violet-electric hover:underline font-normal"
                    >
                      View Product
                    </button>
                    <button
                      onClick={(e) => handleQuickAddToCart(e, product)}
                      className="p-2 bg-violet-electric text-white rounded-full hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                      aria-label="Ajouter au panier"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
                </div>
              </div>
            );
          })}
          </div>
        </PullToRefresh>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Aucun produit trouvé dans cette catégorie
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-violet-electric text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Section Immersive 3D - Produits Tech */}
      <section 
        className="relative w-full h-[90vh] min-h-[700px] overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black mt-16"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Images avec transition fade */}
          <div className="absolute inset-0 w-full h-full">
            {immersiveImages.map((product, index) => {
              const isVisible = index === currentImmersiveIndex;
              const isNext = index === (currentImmersiveIndex + 1) % immersiveImages.length;
              
              return (
                <motion.div
                  key={product.id}
                  className="absolute inset-0 w-full h-full"
                  initial={false}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 1.1,
                  }}
                  transition={{
                    duration: 1.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    zIndex: isVisible ? 10 : isNext ? 5 : 1,
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={index === 0}
                      quality={90}
                      style={{
                        filter: 'brightness(0.7) contrast(1.1)',
                      }}
                    />
                    {/* Overlay gradient pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Effet de lumière/glow qui suit la souris */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: useTransform(glowXPercent, (v) => `${v}%`),
              top: useTransform(glowYPercent, (v) => `${v}%`),
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          
          {/* Indicateurs de position (points en bas) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {immersiveImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImmersiveIndex(index);
                  // Réinitialiser l'intervalle
                  if (immersiveIntervalRef.current) {
                    clearInterval(immersiveIntervalRef.current);
                  }
                  immersiveIntervalRef.current = setInterval(() => {
                    setCurrentImmersiveIndex((prev) => (prev + 1) % immersiveImages.length);
                  }, 11000);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentImmersiveIndex 
                    ? 'w-8 bg-violet-electric' 
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Voir ${immersiveImages[index].name}`}
              />
            ))}
          </div>
          
          {/* Call-to-action subtil au centre */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 text-center"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Link
              href={`/products/${immersiveImages[currentImmersiveIndex]?.id}`}
              className="inline-block px-6 py-3 bg-violet-electric text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-violet-700 active:bg-violet-800"
            >
              Découvrir {immersiveImages[currentImmersiveIndex]?.name}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Modal de détail produit */}
      {selectedProduct && (
        <ProductDetailModal
          product={getProductDetails(selectedProduct.id)!}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Toast de confirmation */}
      {lastAddedProduct && (
        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          message="Produit ajouté au panier"
          productName={lastAddedProduct.name}
          productImage={lastAddedProduct.image}
          quantity={lastAddedProduct.quantity}
          totalItems={itemsCount}
        />
      )}
    </div>
  );
}
