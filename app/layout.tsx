import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://ejs.ticmiton.com"),
  title: {
    default: "Electronica & Jardín Store Europe | High-Tech & Jardinage",
    template: "%s | EJS Market"
  },
  description: "Plateforme E-commerce leader en Europe. Découvrez notre sélection High-tech, matériel de jardinage et électronique de haute qualité.",
  keywords: ["e-commerce", "high-tech", "jardinage", "électronique", "europe", "EJS Market"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EJS Market",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://ejs.ticmiton.com",
    siteName: "EJS Market",
    title: "EJS Market - High-Tech & Jardinage en Europe",
    description: "Le meilleur de l'électronique et du jardinage livré chez vous en Europe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EJS Market - High-Tech & Jardinage",
    description: "Découvrez notre boutique multi-produits pour l'Europe.",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7C3AED",
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

