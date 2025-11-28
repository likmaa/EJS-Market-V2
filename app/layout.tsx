import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { Providers } from "@/app/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClientLayout } from "@/components/ClientLayout";
import { ConditionalHeader, ConditionalFooter } from "@/components/ConditionalLayout";
import { DynamicLayoutComponents } from "@/components/DynamicLayoutComponents";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Electrónica & Jardín Store Europe",
  description: "Plateforme E-commerce multi-produits pour l'Europe",
  manifest: "/manifest.json",
  themeColor: "#7C3AED",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "eJS MARKET",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${plusJakarta.variable} font-sans`}>
        <ErrorBoundary>
          <Providers>
            <CartProvider>
              <WishlistProvider>
                <ComparisonProvider>
                  <ClientLayout>
                    <ConditionalHeader />
                    <ErrorBoundary>
                      <main className="min-h-screen bg-off-white pb-16 lg:pb-0">{children}</main>
                    </ErrorBoundary>
                    <ConditionalFooter />
                    <ErrorBoundary>
                      <DynamicLayoutComponents />
                    </ErrorBoundary>
                  </ClientLayout>
                </ComparisonProvider>
              </WishlistProvider>
            </CartProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

