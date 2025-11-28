'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';

const Header = dynamic(() => import('@/components/Header').then(mod => ({ default: mod.Header })), {
  ssr: true,
});

const MobileHeader = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileHeader })), {
  ssr: false,
});

const Footer = dynamic(() => import('@/components/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: false,
});

const MobileBottomNav = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.MobileBottomNav })), {
  ssr: false,
});

export function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/b2b');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <ErrorBoundary>
        <MobileHeader />
      </ErrorBoundary>
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/b2b');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      <ErrorBoundary>
        <MobileBottomNav />
      </ErrorBoundary>
    </>
  );
}



