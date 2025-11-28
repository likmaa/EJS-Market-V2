'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { NewsBar } from './NewsBar';
import { MegaMenu } from './MegaMenu';
import { LanguageSelector } from './LanguageSelector';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const { itemsCount } = useCart();
  const { user, isAuthenticated, isAdminOrManager } = useAuth();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleExplorerClick = () => {
    console.log('🔵 Explorer clicked, current state:', isMegaMenuOpen);
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };

  return (
    <header className="hidden lg:block sticky top-0 z-[100] bg-off-white border-b border-gray-200 shadow-sm relative">
      {/* News Bar */}
      <NewsBar />

      {/* Main Navigation */}
      <div className="max-w-[1800px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="eJS MARKET"
              width={140}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-10 mx-12">
            {/* Explorer Button */}
            <button
              type="button"
              onClick={handleExplorerClick}
              className="flex items-center gap-1 text-black-deep hover:text-violet-electric transition-colors font-medium text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-electric focus:ring-offset-2 rounded"
              aria-label="Ouvrir le menu Explorer"
              aria-expanded={isMegaMenuOpen}
              aria-haspopup="true"
            >
              Explorer
              <svg
                className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Link href="/products" className="text-black-deep hover:text-violet-electric transition-colors font-medium text-base">
              Boutique
            </Link>
            <Link href="/blog" className="text-black-deep hover:text-violet-electric transition-colors font-medium text-base">
              Blog
            </Link>
          </nav>

          {/* Search Bar - Center (Large) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-16">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Rechercher un produit, une référence..."
                className="w-full px-6 py-3 pl-12 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric text-base"
                aria-label="Rechercher un produit"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* User Menu - Affiché uniquement si connecté */}
            {isAuthenticated && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-black-deep hover:text-violet-electric transition-colors focus:outline-none focus:ring-2 focus:ring-violet-electric focus:ring-offset-2 rounded"
                  aria-label="Menu utilisateur"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="h-8 w-8 rounded-full bg-violet-electric flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon Profil
                    </Link>
                    {isAdminOrManager && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2 text-black-deep hover:text-violet-electric transition-colors focus:outline-none focus:ring-2 focus:ring-violet-electric focus:ring-offset-2 rounded"
              aria-label={`Panier, ${itemsCount} ${itemsCount === 1 ? 'article' : 'articles'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-violet-electric text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1.5 border-2 border-white shadow-md" aria-hidden="true">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </Link>

            {/* BE PRO Button */}
            <Link
              href="/be-pro"
              className="hidden lg:block px-5 py-2.5 bg-black-deep text-white rounded-lg hover:bg-black transition-colors font-medium text-sm"
            >
              Be Pro
            </Link>

            {/* Suivre Ma Commande */}
            <Link
              href="/tracking"
              className="hidden lg:block px-5 py-2.5 border border-violet-electric text-violet-electric rounded-lg hover:bg-violet-50 transition-colors font-medium text-sm"
            >
              Suivre ma commande
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-black-deep focus:outline-none focus:ring-2 focus:ring-violet-electric focus:ring-offset-2 rounded"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Language Selector - Complètement à droite */}
          <div className="hidden lg:flex items-center ml-4 relative z-[110]">
            <LanguageSelector />
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full px-4 py-3 pl-12 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden pb-4 border-t border-gray-200 pt-4" role="menu">
            <nav className="flex flex-col gap-4" aria-label="Navigation mobile">
              <button
                onClick={() => {
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-black-deep hover:text-violet-electric transition-colors font-medium"
              >
                Explorer
              </button>
              <Link href="/products" className="text-black-deep hover:text-violet-electric transition-colors font-medium">
                Boutique
              </Link>
              <Link href="/blog" className="text-black-deep hover:text-violet-electric transition-colors font-medium">
                Blog
              </Link>
              <Link href="/be-pro" className="text-black-deep hover:text-violet-electric transition-colors font-medium">
                Be Pro
              </Link>
              <Link href="/tracking" className="text-black-deep hover:text-violet-electric transition-colors font-medium">
                Suivre ma commande
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Mega Menu */}
      {isMegaMenuOpen && (
        <MegaMenu onClose={() => {
          console.log('🔴 Closing MegaMenu');
          setIsMegaMenuOpen(false);
        }} />
      )}
    </header>
  );
}
