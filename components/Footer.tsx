'use client';

import Link from 'next/link';
import Image from 'next/image';

// URLs des logos officiels depuis CDN publics (Simple Icons - source fiable)
const PAYMENT_LOGOS: Record<string, { local?: string; cdn: string }> = {
  visa: {
    local: '/payment-logos/visa.svg',
    cdn: 'https://cdn.simpleicons.org/visa/1434CB',
  },
  mastercard: {
    local: '/payment-logos/mastercard.svg',
    cdn: 'https://cdn.simpleicons.org/mastercard/EB001B',
  },
  paypal: {
    local: '/payment-logos/paypal.svg',
    cdn: 'https://cdn.simpleicons.org/paypal/003087',
  },
  amex: {
    local: '/payment-logos/amex.svg',
    cdn: 'https://cdn.simpleicons.org/americanexpress/006FCF',
  },
  stripe: {
    local: '/payment-logos/stripe.svg',
    cdn: 'https://cdn.simpleicons.org/stripe/635BFF',
  },
};

// Composant pour afficher un logo de paiement (essaie local d'abord, puis CDN)
function PaymentLogo({ name, alt }: { name: string; alt: string }) {
  const logoConfig = PAYMENT_LOGOS[name];
  if (!logoConfig) return null;

  // Essaie d'abord le logo local, puis le CDN en fallback
  return (
    <div 
      className="w-16 h-10 bg-white border border-gray-200 rounded-md flex items-center justify-center p-2 shadow-sm hover:shadow-md transition-all hover:scale-105"
      title={alt}
    >
      <Image
        src={logoConfig.local || logoConfig.cdn}
        alt={alt}
        width={64}
        height={40}
        className="object-contain w-full h-full transition-all duration-300"
        loading="lazy"
        unoptimized
        style={{
          filter: 'brightness(0) saturate(100%) contrast(200%) drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'brightness(0) saturate(100%) contrast(250%) drop-shadow(0 2px 5px rgba(0,0,0,0.5))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'brightness(0) saturate(100%) contrast(200%) drop-shadow(0 1px 3px rgba(0,0,0,0.3))';
        }}
        onError={(e) => {
          // Si le fichier local échoue, utilise le CDN
          const target = e.target as HTMLImageElement;
          if (logoConfig.local && target.src !== logoConfig.cdn) {
            target.src = logoConfig.cdn;
          }
        }}
      />
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1800px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo et Réseaux sociaux */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image
                src="/logo.png"
                alt="eJS MARKET"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-violet-electric text-white hover:bg-violet-700 transition-all duration-200 hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* À propos */}
          <div>
            <h3 className="text-violet-electric font-bold mb-6 text-lg">À propos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/be-pro" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Programme Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="text-violet-electric font-bold mb-6 text-lg">Aide</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Retours
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Suivre ma commande
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-violet-electric font-bold mb-6 text-lg">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-600 hover:text-violet-electric transition-colors text-sm">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} <span className="font-semibold text-black-deep">eJS MARKET</span>. Tous droits réservés.
            </p>
            
            {/* Paiements acceptés */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-gray-500 text-sm font-medium">Paiements sécurisés :</span>
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {/* Logos de paiement depuis CDN ou fichiers locaux */}
                <PaymentLogo name="visa" alt="Visa" />
                <PaymentLogo name="mastercard" alt="Mastercard" />
                <PaymentLogo name="paypal" alt="PayPal" />
                <PaymentLogo name="amex" alt="American Express" />
                <PaymentLogo name="stripe" alt="Stripe" />
              </div>
              
              {/* Badges de sécurité */}
              <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
                {/* SSL */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 shadow-sm hover:shadow-md transition-all">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                  <span className="text-xs font-bold whitespace-nowrap">SSL Sécurisé</span>
                </div>
                
                {/* PCI DSS */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 shadow-sm hover:shadow-md transition-all">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-xs font-bold whitespace-nowrap">PCI DSS</span>
                </div>
                
                {/* 3D Secure */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg text-violet-700 shadow-sm hover:shadow-md transition-all">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                  </svg>
                  <span className="text-xs font-bold whitespace-nowrap">3D Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

