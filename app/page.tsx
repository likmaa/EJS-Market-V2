'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice, calculateTTC } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Toast } from '@/components/Toast';

// Lazy load les composants lourds
const Marquee = dynamic(() => import('react-fast-marquee'), {
  ssr: false,
  loading: () => <div className="h-20" />,
});

const MobileProductCard = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileProductCard })), {
  ssr: false,
});

const MobileProductCarousel = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileProductCarousel })), {
  ssr: false,
});

const MobileFiltersBar = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileFiltersBar })), {
  ssr: false,
});

// Lazy load le modal pour améliorer les performances
const ProductDetailModal = dynamic(() => import('@/components/ProductDetailModal').then(mod => ({ default: mod.ProductDetailModal })), {
  loading: () => null,
  ssr: false,
});
import { useCart } from '@/contexts/CartContext';

// Type pour un logo partenaire
interface PartnerLogo {
  id: string;
  name: string;
  logoPath: string;
  cdnUrl: string | null;
  width: number | null;
  height: number | null;
  alt: string;
}

// Composant pour afficher un logo partenaire (essaie local d'abord, puis CDN)
function PartnerLogoItem({ brand }: { brand: PartnerLogo }) {
  return (
    <div className="mx-16 flex items-center justify-center h-20 flex-shrink-0">
      <div className="relative opacity-70 hover:opacity-100 transition-all duration-300">
        <Image
          src={brand.logoPath}
          alt={brand.alt || `Logo ${brand.name}`}
          width={brand.width || 120}
          height={brand.height || 40}
          className="h-14 w-auto object-contain transition-all duration-300"
          loading="lazy"
          unoptimized
          style={{
            filter: 'brightness(0) saturate(100%) contrast(200%) drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0) saturate(100%) contrast(250%) drop-shadow(0 4px 8px rgba(0,0,0,0.6))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(0) saturate(100%) contrast(200%) drop-shadow(0 2px 6px rgba(0,0,0,0.4))';
          }}
          onError={(e) => {
            // Si le fichier local échoue, utilise le CDN
            const target = e.target as HTMLImageElement;
            if (brand.cdnUrl && target.src !== brand.cdnUrl) {
              target.src = brand.cdnUrl;
            }
          }}
        />
      </div>
    </div>
  );
}

// Questions FAQ
interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Quels sont les délais de livraison ?',
    answer: 'Nous livrons partout en Europe. Les délais varient selon la destination : 2-3 jours ouvrables pour la France, 3-5 jours pour le reste de l\'Europe. Les produits en stock sont expédiés sous 24h.',
  },
  {
    question: 'Quels sont les modes de paiement acceptés ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, virement bancaire, et les paiements en plusieurs fois via Klarna. Tous les paiements sont sécurisés et cryptés.',
  },
  {
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous disposez de 30 jours pour retourner un produit non utilisé et dans son emballage d\'origine. Les frais de retour sont à votre charge sauf en cas d\'erreur de notre part. Le remboursement est effectué sous 14 jours.',
  },
  {
    question: 'Les produits sont-ils garantis ?',
    answer: 'Tous nos produits bénéficient de la garantie constructeur (minimum 2 ans dans l\'UE). Nous proposons également une garantie prolongée sur la plupart des produits électroniques. Consultez les détails sur chaque fiche produit.',
  },
  {
    question: 'Comment suivre ma commande ?',
    answer: 'Dès l\'expédition, vous recevez un email avec votre numéro de suivi. Vous pouvez suivre votre colis en temps réel depuis votre compte ou en utilisant la page "Suivre ma commande" avec votre numéro de commande.',
  },
  {
    question: 'Proposez-vous des services après-vente ?',
    answer: 'Oui, notre équipe SAV est disponible du lundi au vendredi de 9h à 18h. Nous proposons l\'assistance technique, la réparation, et le remplacement des pièces détachées pour tous nos produits. Contactez-nous par email ou téléphone.',
  },
  {
    question: 'Les prix incluent-ils la TVA ?',
    answer: 'Oui, tous les prix affichés incluent la TVA (taux variable selon le pays de livraison). Le prix TTC est clairement indiqué sur chaque produit. Le prix HT est également visible dans le panier.',
  },
  {
    question: 'Proposez-vous des remises pour les professionnels ?',
    answer: 'Oui, nous avons un programme "Be Pro" spécialement conçu pour les professionnels. Inscrivez-vous pour bénéficier de remises allant jusqu\'à 20% selon les volumes, un service dédié, et des conditions de paiement adaptées.',
  },
];

export default function Home() {
  const titles = useMemo(() => ['eJS MARKET', 'Electrónica & Jardín'], []);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const { addToCart, itemsCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{ name: string; image: string; quantity: number } | null>(null);
  
  // États pour les filtres
  const [openDropdown, setOpenDropdown] = useState<'category' | 'univers' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUnivers, setSelectedUnivers] = useState<string[]>([]);
  
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
      id: 'gaming', 
      label: 'Gaming', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
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
  
  const universOptions = [
    { id: 'tech', label: 'Tech', icon: '💻' },
    { id: 'jardin', label: 'Jardin', icon: '🌿' },
  ];
  
  // Calcul du nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedUnivers.length > 0) count += selectedUnivers.length;
    return count;
  }, [selectedCategories, selectedUnivers]);
  
  // Références pour fermer les dropdowns au clic extérieur
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const universDropdownRef = useRef<HTMLDivElement>(null);
  
  // Fermer les dropdowns au clic extérieur - UNIQUEMENT quand un dropdown est ouvert
  useEffect(() => {
    // Ne créer l'écouteur QUE si un dropdown est ouvert
    if (!openDropdown) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Ne JAMAIS fermer si le clic est dans le header (pour ne pas bloquer Explorer, Language, etc.)
      const header = document.querySelector('header');
      if (header && header.contains(target)) {
        return;
      }
      
      // Ne pas fermer si le clic est dans les dropdowns de filtres
      if (categoryDropdownRef.current && categoryDropdownRef.current.contains(target)) {
        return;
      }
      if (universDropdownRef.current && universDropdownRef.current.contains(target)) {
        return;
      }
      
      // Fermer si le clic est vraiment en dehors
      setOpenDropdown(null);
    };
    
    // Utiliser un délai pour éviter les conflits
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
  
  const toggleUnivers = (universId: string) => {
    setSelectedUnivers((prev) =>
      prev.includes(universId)
        ? prev.filter((id) => id !== universId)
        : [...prev, universId]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedUnivers([]);
    setOpenDropdown(null);
  };
  
  const removeFilter = (type: 'category' | 'univers', id?: string) => {
    if (type === 'category' && id) {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    } else if (type === 'univers' && id) {
      setSelectedUnivers((prev) => prev.filter((universId) => universId !== id));
    }
  };
  
  // États pour les carrousels
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const [currentJardinIndex, setCurrentJardinIndex] = useState(0);
  
  // Références pour les intervalles
  const techIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const jardinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  // Charger les partenaires depuis l'API
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);

  // Charger les témoignages depuis l'API
  const [testimonials, setTestimonials] = useState<Array<{
    id: string;
    name: string;
    initial: string;
    rating: number;
    text: string;
    product: string;
    date: string;
  }>>([]);
  
  // Charger les images hero depuis l'API
  const [techImages, setTechImages] = useState<Array<{
    id: string;
    url: string;
    name: string;
    price: number | null;
    available: boolean;
    mediaType?: 'image' | 'video';
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
  }>>([]);
  
  const [jardinImages, setJardinImages] = useState<Array<{
    id: string;
    url: string;
    name: string;
    price: number | null;
    available: boolean;
    mediaType?: 'image' | 'video';
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
  }>>([]);

  const [immersiveImages, setImmersiveImages] = useState<Array<{
    id: string;
    url: string;
    name: string;
    mediaType?: 'image' | 'video';
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
  }>>([]);

  // Charger les images hero
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const [techRes, gardenRes] = await Promise.all([
          fetch('/api/content/hero-images?type=tech', {
            cache: 'force-cache', // Utiliser le cache du navigateur
          }),
          fetch('/api/content/hero-images?type=garden', {
            cache: 'force-cache', // Utiliser le cache du navigateur
          }),
        ]);

        if (techRes.ok) {
          const techData = await techRes.json();
          setTechImages(techData.images.map((img: any) => ({
            id: img.id,
            url: img.mediaType === 'video' ? (img.thumbnailUrl || img.videoUrl) : img.imageUrl,
            name: img.name,
            price: img.price ? img.price / 100 : null,
            available: img.available,
            mediaType: img.mediaType || 'image',
            videoUrl: img.videoUrl,
            thumbnailUrl: img.thumbnailUrl,
          })));
        }

        if (gardenRes.ok) {
          const gardenData = await gardenRes.json();
          const mappedImages = gardenData.images
            .filter((img: any) => img.imageUrl || (img.mediaType === 'video' && img.videoUrl))
            .map((img: any) => ({
              id: img.id,
              url: img.mediaType === 'video' ? (img.thumbnailUrl || img.videoUrl || '') : (img.imageUrl || ''),
              name: img.name,
              price: img.price ? img.price / 100 : null,
              available: img.available,
              mediaType: img.mediaType || 'image',
              videoUrl: img.videoUrl,
              thumbnailUrl: img.thumbnailUrl,
            }));
          setJardinImages(mappedImages);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images hero:', error);
        // Fallback sur les données statiques si l'API échoue
        setTechImages([
          { id: '1', url: '/img1.jpg', name: 'iPhone 15 Pro Max', price: 1399, available: true, mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
          { id: '2', url: '/img2.jpg', name: 'MacBook Pro M3', price: 2499, available: true, mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
          { id: '3', url: '/img3.jpg', name: 'PlayStation 5', price: 499, available: false, mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
        ]);
        setJardinImages([
          { id: '1', url: '/jard1.jpg', name: 'Robot Tondeuse Automower 430X', price: 2499, available: true, mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
          { id: '2', url: '/jard2.jpg', name: 'Tondeuse Robot Gardena', price: 899, available: true, mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
          { id: '3', url: '/jard3.jpg', name: 'Tronçonneuse STIHL', price: 349, available: true, mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
        ]);
      }
    };

    fetchHeroImages();
  }, []);

  // Charger les images immersives (avec cache)
  useEffect(() => {
    const fetchImmersiveImages = async () => {
      try {
        const res = await fetch('/api/content/immersive-images', {
          cache: 'force-cache', // Utiliser le cache du navigateur
        });
        if (res.ok) {
          const data = await res.json();
          setImmersiveImages(data.images.map((img: any) => ({
            id: img.id,
            url: img.mediaType === 'video' ? (img.thumbnailUrl || img.videoUrl) : img.imageUrl,
            name: img.name,
            mediaType: img.mediaType || 'image',
            videoUrl: img.videoUrl,
            thumbnailUrl: img.thumbnailUrl,
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images immersives:', error);
        // Fallback sur les données statiques
        setImmersiveImages([
          { id: '1', url: '/img1.jpg', name: 'iPhone 15 Pro Max', mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
          { id: '2', url: '/img2.jpg', name: 'MacBook Pro M3', mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
          { id: '3', url: '/img3.jpg', name: 'PlayStation 5', mediaType: 'image' as const, videoUrl: null, thumbnailUrl: null },
        ]);
      }
    };

    fetchImmersiveImages();
  }, []);

  // Charger les partenaires (avec cache)
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/content/partners', {
          cache: 'force-cache', // Utiliser le cache du navigateur
        });
        if (res.ok) {
          const data = await res.json();
          setPartnerLogos(data.partners.map((partner: any) => ({
            id: partner.id,
            name: partner.name,
            logoPath: partner.logoPath,
            cdnUrl: partner.cdnUrl,
            width: partner.width,
            height: partner.height,
            alt: partner.alt,
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des partenaires:', error);
        // Fallback sur les données statiques si l'API échoue
        setPartnerLogos([
          { id: '1', name: 'Apple', logoPath: '/logos/apple.svg', cdnUrl: 'https://cdn.simpleicons.org/apple/000000', width: 120, height: 40, alt: 'Logo Apple' },
          { id: '2', name: 'Samsung', logoPath: '/logos/samsung.svg', cdnUrl: 'https://cdn.simpleicons.org/samsung/1428A0', width: 120, height: 40, alt: 'Logo Samsung' },
          { id: '3', name: 'Sony', logoPath: '/logos/sony.svg', cdnUrl: 'https://cdn.simpleicons.org/sony/000000', width: 120, height: 40, alt: 'Logo Sony' },
        ]);
      }
    };

    fetchPartners();
  }, []);

  // Charger les témoignages (avec cache)
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/content/testimonials', {
          cache: 'force-cache', // Utiliser le cache du navigateur
        });
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.testimonials.map((testimonial: any) => {
            const text = typeof testimonial.text === 'string' 
              ? JSON.parse(testimonial.text) 
              : testimonial.text;
            return {
              id: testimonial.id,
              name: testimonial.name,
              initial: testimonial.initial,
              rating: testimonial.rating,
              text: text?.fr || text || '',
              product: testimonial.product,
              date: testimonial.date,
            };
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
        // Fallback sur les données statiques si l'API échoue
        setTestimonials([
          { id: '1', name: 'Marie L.', initial: 'ML', rating: 5, text: 'Livraison rapide et produit de qualité. Je recommande vivement !', product: 'iPhone 15 Pro', date: 'Il y a 2 semaines' },
          { id: '2', name: 'Jean D.', initial: 'JD', rating: 5, text: 'Excellent service client et robot tondeuse parfait. Mon jardin n\'a jamais été aussi beau !', product: 'Robot Tondeuse Automower', date: 'Il y a 1 mois' },
        ]);
      }
    };

    fetchTestimonials();
  }, []);

  // Fonction pour obtenir l'index suivant dans un carrousel
  const getNextIndex = useCallback((current: number, length: number) => {
    return (current + 1) % length;
  }, []);
  
  // Auto-play pour les carrousels - Avec intervalles différents pour éviter la synchronisation
  useEffect(() => {
    // Nettoyer les intervalles précédents s'ils existent
    if (techIntervalRef.current) {
      clearInterval(techIntervalRef.current);
    }
    if (jardinIntervalRef.current) {
      clearInterval(jardinIntervalRef.current);
    }
    
    // Carrousel Tech - démarre immédiatement, change toutes les 8 secondes
    techIntervalRef.current = setInterval(() => {
      setCurrentTechIndex((prev) => (prev + 1) % techImages.length);
    }, 8000); // 8 secondes
    
    // Carrousel Jardin - démarre avec un délai initial de 2 secondes, puis change toutes les 8.5 secondes
    // Des intervalles différents (8s vs 8.5s) garantissent qu'ils ne se synchroniseront jamais
    if (jardinImages.length > 0) {
      setTimeout(() => {
        // Première transition après 2 secondes
        setCurrentJardinIndex((prev) => (prev + 1) % jardinImages.length);
        
        // Puis continue toutes les 8.5 secondes (différent de 8 secondes)
        jardinIntervalRef.current = setInterval(() => {
          setCurrentJardinIndex((prev) => (prev + 1) % jardinImages.length);
        }, 8500); // 8.5 secondes - différent de l'intervalle Tech
      }, 2000); // Délai initial de 2 secondes
    }
    
    return () => {
      if (techIntervalRef.current) {
        clearInterval(techIntervalRef.current);
      }
      if (jardinIntervalRef.current) {
        clearInterval(jardinIntervalRef.current);
      }
    };
  }, [techImages.length, jardinImages.length]);
  
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

  useEffect(() => {
    if (titles.length === 0) return;
    
    const currentTitle = titles[currentTitleIndex];
    if (!currentTitle) return;
    
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 30 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentTitle.length) {
        setDisplayedText(currentTitle.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentTitle.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex > 0) {
        setDisplayedText(currentTitle.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentTitleIndex, titles]);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Masqué sur mobile */}
      <section className="hidden md:block relative bg-white pt-4 pb-8">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          {/* 1. Barre de filtres en haut */}
          <div className="bg-gray-soft rounded-xl px-6 py-4 mb-8 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Ligne principale avec boutons de filtres */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Dropdown Category */}
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        openDropdown === 'category' || selectedCategories.length > 0
                          ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                      }`}
                    >
                      Category
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
                    
                    {/* Dropdown Menu */}
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

                  {/* Dropdown Univers */}
                  <div className="relative" ref={universDropdownRef}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'univers' ? null : 'univers')}
                      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        openDropdown === 'univers' || selectedUnivers.length > 0
                          ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                      }`}
                    >
                      Univers
                      {selectedUnivers.length > 0 && (
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                          {selectedUnivers.length}
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'univers' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openDropdown === 'univers' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px]"
                        >
                          <div className="space-y-1">
                            {universOptions.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => toggleUnivers(option.id)}
                                className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                                  selectedUnivers.includes(option.id)
                                    ? 'bg-violet-electric/10 text-violet-electric font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span className="flex-shrink-0">{option.icon}</span>
                                <span className="flex-1">{option.label}</span>
                                {selectedUnivers.includes(option.id) && (
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
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2.5 bg-transparent text-gray-600 rounded-lg font-medium text-sm hover:bg-white/80 hover:text-violet-electric transition-all duration-200 flex items-center gap-2"
                  >
                    Reset filters
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tags des filtres actifs */}
              {(selectedCategories.length > 0 || selectedUnivers.length > 0) && (
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
                  {selectedUnivers.map((universId) => {
                    const univers = universOptions.find((u) => u.id === universId);
                    return univers ? (
                      <motion.button
                        key={universId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => removeFilter('univers', universId)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                      >
                        <span>{univers.icon}</span>
                        <span>{univers.label}</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    ) : null;
                  })}
                </motion.div>
              )}
            </div>
          </div>

          {/* 3. Carte "Learn more about market" à droite - au-dessus du titre */}
          <div className="flex justify-end mb-8">
            <div className="bg-violet-electric rounded-lg px-5 py-3 max-w-xs">
              <p className="text-white font-medium mb-1 text-xs">
                Discover specially curated products.
              </p>
              <Link href="/about" className="text-white underline font-medium text-xs">
                Learn more about market
              </Link>
            </div>
          </div>

          {/* 2. Titre et description au centre */}
          <div className="text-center mb-16">
            {/* Avis Trustpilot */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black-deep">4.8</span>
                <span className="text-sm text-gray-600">sur</span>
                <span className="text-sm font-semibold text-black-deep">Trustpilot</span>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-sm text-gray-600">2,547 avis</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-violet-electric mb-6 min-h-[1.2em]">
              {displayedText || 'eJS MARKET'}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Votre marketplace premium pour l&apos;électronique et le jardinage intelligent.{' '}
              <br className="hidden md:block" />
              Des milliers de produits sélectionnés, livrés rapidement partout en Europe.
            </p>
            <div className="flex justify-center">
              <Link href="/products">
                <Button className="bg-violet-electric hover:bg-violet-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Voir la boutique
                </Button>
              </Link>
            </div>
          </div>

          {/* 4. Deux grandes grilles avec carrousels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carte 1 - Carrousel Tech */}
            <div className="h-[700px] overflow-hidden relative group bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:border-violet-electric/30">
              <div className="relative h-full w-full">
                <div className="overflow-hidden relative h-full w-full">
                  <div 
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentTechIndex * 100}%)` }}
                  >
                    {techImages.map((product, index) => {
                      const isVisible = index === currentTechIndex;
                      const isNext = index === getNextIndex(currentTechIndex, techImages.length);
                      // Charger seulement l'image visible et la suivante
                      const shouldLoad = isVisible || isNext;
                      
                      return (
                    <div
                      key={product.id}
                          className="min-w-full h-full relative flex-shrink-0"
                    >
                          <div className="relative w-full h-full bg-gray-200">
                            {shouldLoad && (
                              product.mediaType === 'video' && product.videoUrl ? (
                                <video
                                  src={product.videoUrl}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  poster={product.thumbnailUrl || product.url}
                                />
                              ) : (
                                <Image
                                  src={product.url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                  priority={index === 0}
                                  loading={index === 0 ? 'eager' : 'lazy'}
                                  quality={85}
                                />
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Informations produit en bas */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white text-xl font-bold mb-2">
                          {techImages[currentTechIndex]?.name}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <p className="text-white text-2xl font-bold">
                            {techImages[currentTechIndex]?.price ? formatPrice(techImages[currentTechIndex].price * 100) : ''}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            techImages[currentTechIndex]?.available 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {techImages[currentTechIndex]?.available ? 'En stock' : 'Rupture de stock'}
                          </span>
                        </div>
                        <Link 
                          href={`/products/${techImages[currentTechIndex]?.id}`}
                          className="inline-block text-sm text-violet-electric hover:underline font-normal"
                          aria-label={`Voir les détails de ${techImages[currentTechIndex]?.name}`}
                        >
                          Voir produit
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicateurs */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {techImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTechIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentTechIndex ? 'w-8 bg-violet-electric' : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Afficher le produit ${index + 1}`}
                        aria-current={index === currentTechIndex ? 'true' : 'false'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 2 - Carrousel Jardin */}
            <div className="h-[700px] overflow-hidden relative group bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:border-green-garden/30">
              <div className="relative h-full w-full">
                {jardinImages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-garden mx-auto mb-4"></div>
                      <p className="text-gray-500">Chargement des produits jardin...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden relative h-full w-full">
                      <div 
                        className="flex h-full transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentJardinIndex * 100}%)` }}
                      >
                        {jardinImages.map((product, index) => {
                      const isVisible = index === currentJardinIndex;
                      const isNext = index === getNextIndex(currentJardinIndex, jardinImages.length);
                      // Charger seulement l'image visible et la suivante
                      const shouldLoad = isVisible || isNext;
                      
                      return (
                    <div
                      key={product.id}
                          className="min-w-full h-full relative flex-shrink-0"
                    >
                          <div className="relative w-full h-full bg-gray-200" style={{ aspectRatio: '1 / 1' }}>
                            {shouldLoad && (
                              product.mediaType === 'video' && product.videoUrl ? (
                                <video
                                  src={product.videoUrl}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  poster={product.thumbnailUrl || product.url}
                                />
                              ) : (
                                <Image
                                  src={product.url}
                                  alt={`${product.name} - Produit jardin`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                  priority={index === 0}
                                  loading={index === 0 ? 'eager' : 'lazy'}
                                  quality={85}
                                  placeholder="blur"
                                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                />
                              )
                            )}
                          </div>
                        </div>
                      );
                        })}
                      </div>
                      {/* Informations produit en bas */}
                      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-white text-xl font-bold mb-2">
                              {jardinImages[currentJardinIndex]?.name || 'Chargement...'}
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                              <p className="text-white text-2xl font-bold">
                                {jardinImages[currentJardinIndex]?.price ? formatPrice(jardinImages[currentJardinIndex].price * 100) : ''}
                              </p>
                              {jardinImages[currentJardinIndex] && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  jardinImages[currentJardinIndex].available 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-red-500 text-white'
                                }`}>
                                  {jardinImages[currentJardinIndex].available ? 'En stock' : 'Rupture de stock'}
                                </span>
                              )}
                            </div>
                            {jardinImages[currentJardinIndex] && (
                              <Link 
                                href={`/products/${jardinImages[currentJardinIndex].id}`}
                                className="inline-block text-sm text-violet-electric hover:underline font-normal"
                                aria-label={`Voir les détails de ${jardinImages[currentJardinIndex].name}`}
                              >
                                Voir produit
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicateurs */}
                      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {jardinImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentJardinIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === currentJardinIndex ? 'w-8 bg-green-garden' : 'w-2 bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Afficher le produit ${index + 1}`}
                            aria-current={index === currentJardinIndex ? 'true' : 'false'}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section Mobile - Titre et sous-titre seulement */}
      <section className="md:hidden relative bg-white pt-6 pb-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-violet-electric mb-4">
              {displayedText || 'eJS MARKET'}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Votre marketplace premium pour l&apos;électronique et le jardinage intelligent. Des milliers de produits sélectionnés, livrés rapidement partout en Europe.
            </p>
          </div>
          
          {/* Barre de filtres mobile uniquement sur la page d'accueil */}
          <div className="px-0">
            <MobileFiltersBar
              categoryOptions={categoryOptions}
              universOptions={universOptions}
              selectedCategories={selectedCategories}
              selectedUnivers={selectedUnivers}
              onToggleCategory={toggleCategory}
              onToggleUnivers={toggleUnivers}
              onResetFilters={resetFilters}
            />
          </div>
        </div>
      </section>

      {/* Trending (Produits Phares) */}
      <section className="pt-4 md:pt-8 pb-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-0 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          {/* Version Mobile - Carrousel horizontal */}
          <div className="lg:hidden w-full overflow-hidden">
            <MobileProductCarousel
              products={[
                { id: 1, name: 'iPhone 15 Pro', creator: 'Apple', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', price: 1199 },
                { id: 2, name: 'PlayStation 5', creator: 'Sony', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', price: 499 },
                { id: 3, name: 'Sony Alpha 7 IV', creator: 'Sony', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 2799 },
                { id: 4, name: 'MacBook Pro M3', creator: 'Apple', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', price: 1999 },
                { id: 5, name: 'Robot Tondeuse Automower 430X', creator: 'Husqvarna', category: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 2499 },
                { id: 6, name: 'Tondeuse Robot Gardena', creator: 'Gardena', category: 'Univers Jardin', image: '/jard2.jpg', price: 899 },
                { id: 7, name: 'Tronçonneuse STIHL', creator: 'STIHL', category: 'Univers Jardin', image: '/jard3.jpg', price: 349 },
                { id: 8, name: 'Aspirateur Robot Roomba', creator: 'iRobot', category: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', price: 599 },
              ]}
              onViewProduct={(product) => {
                setSelectedProduct(product);
                setIsModalOpen(true);
              }}
            />
            <div className="text-center mt-6">
              <Link href="/products" className="text-base text-violet-electric hover:underline font-bold">
                Voir tous les produits
              </Link>
            </div>
          </div>

          {/* Version Desktop - Grille */}
          <div className="hidden lg:grid grid-cols-4 gap-4 items-stretch">
            {[
              { id: 1, name: 'iPhone 15 Pro', creator: 'Apple', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', price: 1199 },
              { id: 2, name: 'PlayStation 5', creator: 'Sony', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', price: 499 },
              { id: 3, name: 'Sony Alpha 7 IV', creator: 'Sony', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', price: 2799 },
              { id: 4, name: 'MacBook Pro M3', creator: 'Apple', category: 'Univers Tech', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', price: 1999 },
              { id: 5, name: 'Robot Tondeuse Automower 430X', creator: 'Husqvarna', category: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500', price: 2499 },
              { id: 6, name: 'Tondeuse Robot Gardena', creator: 'Gardena', category: 'Univers Jardin', image: '/jard2.jpg', price: 899 },
              { id: 7, name: 'Tronçonneuse STIHL', creator: 'STIHL', category: 'Univers Jardin', image: '/jard3.jpg', price: 349 },
              { id: 8, name: 'Aspirateur Robot Roomba', creator: 'iRobot', category: 'Univers Jardin', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', price: 599 },
            ].map((product) => (
              <Card key={product.id} hover className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm group">
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
                    <p className="text-xs text-gray-400 mb-2 font-normal">{product.category}</p>
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
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="text-sm text-violet-electric hover:underline font-normal"
                    >
                      View Product
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const priceHT = product.price * 100;
                        addToCart(
                          {
                            productId: String(product.id),
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
                      }}
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
            ))}
          </div>
          <div className="hidden lg:block text-center mt-8">
            <Link href="/products" className="text-base text-violet-electric hover:underline font-bold">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* Section Immersive 3D - Produits Tech - Masquée sur mobile */}
      <section 
        className="hidden md:block relative w-full h-screen min-h-[800px] overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
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
                    {product.mediaType === 'video' && product.videoUrl ? (
                      <video
                        src={product.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={product.thumbnailUrl || product.url}
                        style={{
                          filter: 'brightness(0.7) contrast(1.1)',
                        }}
                      />
                    ) : (
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
                    )}
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
          
          {/* Call-to-action subtil au centre (optionnel - peut être retiré pour plus de minimalisme) */}
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

      {/* Témoignages - Défilement Horizontal - Masqués sur mobile */}
      <section className="hidden md:block py-20 bg-off-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-black-deep">
            Ce que disent nos clients
          </h2>
          
          {/* Défilement continu des témoignages */}
          <div className="relative">
            <Marquee
              speed={40}
              gradient={true}
              gradientColor="#FAFAFA"
              gradientWidth={100}
              pauseOnHover={true}
              className="py-4"
            >
              {testimonials.length > 0 ? (
                [...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={`${testimonial.id}-${index}`} className="mx-4 w-[350px] flex-shrink-0">
                    <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-8 flex flex-col h-full">
                        {/* Avatar et nom */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-violet-electric/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-violet-electric font-bold text-lg">
                              {testimonial.initial}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg text-black-deep mb-1">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {testimonial.product}
                            </p>
                          </div>
                        </div>
                        
                        {/* Étoiles */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, j) => (
                            <svg
                              key={j}
                              className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        
                        {/* Commentaire */}
                        <p className="text-gray-700 mb-6 italic text-base leading-relaxed flex-1">
                          &quot;{testimonial.text}&quot;
                        </p>
                        
                        {/* Date */}
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            {testimonial.date}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chargement des témoignages...
                </div>
              )}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Partenaires - Défilement Horizontal Infini - Masqués sur mobile */}
      <section className="hidden md:block py-12 bg-white overflow-hidden">
        <Marquee
          speed={50}
          direction="right"
          gradient={true}
          gradientColor="#FFFFFF"
          gradientWidth={100}
          pauseOnHover={true}
          className="py-6"
        >
          {/* Première passe des logos */}
          {partnerLogos.map((brand, index) => (
            <PartnerLogoItem
              key={`${brand.name}-1-${index}`}
              brand={brand}
            />
          ))}
          {/* Deuxième passe pour l'effet infini (hors écran initialement) */}
          {partnerLogos.map((brand, index) => (
            <PartnerLogoItem
              key={`${brand.name}-2-${index}`}
              brand={brand}
            />
          ))}
        </Marquee>
      </section>

      {/* FAQ et Newsletter - Sections avec gradient continu */}
      <div className="relative">
        {/* Gradient continu qui couvre les deux sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900 via-purple-900 to-indigo-950">
          {/* Effet de grain/texture */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />
          {/* Dégradé supplémentaire pour plus de profondeur sombre */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </div>

        {/* FAQ - Questions Fréquentes */}
        <section className="pt-20 pb-12 relative">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">
              Questions Fréquentes
            </h2>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Disclosure key={index} as="div" className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-lg font-semibold text-white hover:bg-white/10 transition-colors duration-200 rounded-2xl">
                        <span>{item.question}</span>
                        <motion.svg
                          className="w-5 h-5 text-white transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </Disclosure.Button>
                      <Disclosure.Panel className="overflow-hidden">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-5 pt-2">
                            <p className="text-white/90 leading-relaxed">{item.answer}</p>
                          </div>
                        </motion.div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
            
            {/* Contact additionnel */}
            <div className="mt-12 text-center">
              <p className="text-white/80 mb-4">
                Vous ne trouvez pas la réponse à votre question ?
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-white text-violet-700 rounded-lg font-semibold text-base transition-all duration-200 hover:bg-white/90 active:bg-white/80 hover:scale-105 shadow-lg"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="pt-12 pb-20 relative">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterForm />
          </div>
        </section>
      </div>

      {/* Modal de détail produit */}
      {selectedProduct && (
        <ProductDetailModal
          product={{
            id: String(selectedProduct.id),
            sku: `SKU-${selectedProduct.id}`,
            name: selectedProduct.name,
            creator: selectedProduct.creator,
            description: { fr: `Description de ${selectedProduct.name}`, en: '' },
            priceHT: selectedProduct.price * 100,
            vatRate: 0.20,
            brand: selectedProduct.creator,
            category: selectedProduct.category === 'Univers Tech' ? 'electronics' : 'garden',
            categoryLabel: selectedProduct.category,
            stock: 10,
            isActive: true,
            images: [selectedProduct.image, selectedProduct.image],
            attributes: {},
            features: [],
          }}
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

// Composant Newsletter avec gestion d'état
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation basique
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      setIsSubmitting(false);
      return;
    }

    // Simulation d'envoi (à remplacer par un appel API réel)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici vous devriez appeler votre API pour enregistrer l'email
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
      
      setIsSuccess(true);
      setEmail('');
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full px-5 py-4 rounded-lg bg-white/10 backdrop-blur-md border-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors duration-200 text-white placeholder-white/60"
            disabled={isSubmitting}
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="whitespace-nowrap bg-white text-violet-700 hover:bg-white/90 active:bg-white/80 hover:scale-105 shadow-lg"
        >
          {isSubmitting ? 'Envoi...' : 'S\'inscrire'}
        </Button>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-green-300 text-sm font-medium"
        >
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Merci ! Vous êtes maintenant inscrit à notre newsletter.
          </span>
        </motion.div>
      )}
      
      <p className="mt-4 text-center text-sm text-white/70">
        En vous inscrivant, vous acceptez notre{' '}
        <Link href="/privacy" className="text-white hover:underline font-medium">
          politique de confidentialité
        </Link>
        . Vous pouvez vous désinscrire à tout moment.
      </p>
    </form>
  );
}
