'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { OrderTrackingModal } from '@/components/OrderTrackingModal';

interface TrackingStep {
  id: string;
  label: string;
  date?: string;
  completed: boolean;
  isActive?: boolean;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  totalTTC: number;
  trackingNumber?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    priceTTC: number;
    image: string;
  }>;
  createdAt: string;
  estimatedDelivery?: string;
}

// Données mockées pour démo (à remplacer par API)
const mockOrders: Record<string, OrderDetails> = {
  'CMD-2025-001': {
    id: '1',
    orderNumber: 'CMD-2025-001',
    status: 'SHIPPED',
    totalTTC: 143880,
    trackingNumber: 'TRACK123456789',
    shippingAddress: {
      firstName: 'Jean',
      lastName: 'Dupont',
      addressLine1: '123 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      country: 'FR',
    },
    items: [
      {
        name: 'Casque Sony WH-1000XM5',
        quantity: 1,
        priceTTC: 47880,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      },
      {
        name: 'iPhone 15 Pro',
        quantity: 1,
        priceTTC: 143880,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      },
    ],
    createdAt: '2025-01-15T10:30:00',
    estimatedDelivery: '2025-01-20',
  },
  'CMD-2025-002': {
    id: '2',
    orderNumber: 'CMD-2025-002',
    status: 'DELIVERED',
    totalTTC: 249900,
    trackingNumber: 'TRACK987654321',
    shippingAddress: {
      firstName: 'Marie',
      lastName: 'Martin',
      addressLine1: '45 Avenue des Champs',
      city: 'Lyon',
      postalCode: '69001',
      country: 'FR',
    },
    items: [
      {
        name: 'Robot Tondeuse Automower 430X',
        quantity: 1,
        priceTTC: 299880,
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500',
      },
    ],
    createdAt: '2025-01-10T14:20:00',
    estimatedDelivery: '2025-01-18',
  },
};


export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    // Simulation de recherche (à remplacer par API)
    await new Promise(resolve => setTimeout(resolve, 800));

    const order = mockOrders[orderNumber.toUpperCase()];
    
    if (order) {
      setSearchedOrder(order);
      setIsModalOpen(true);
      setOrderNumber(''); // Réinitialiser le champ après succès
    } else {
      setError('Commande non trouvée. Vérifiez votre numéro de commande.');
      setSearchedOrder(null);
      setIsModalOpen(false);
    }
    
    setIsSearching(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-off-white via-white to-gray-50 py-12">
      <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-electric/10 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Suivre ma commande
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entrez votre numéro de commande pour suivre l&apos;état de votre colis en temps réel
            </p>
          </motion.div>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                      Numéro de commande
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="orderNumber"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          placeholder="Ex: CMD-2025-001"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none transition-all text-lg"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto px-8 py-4 bg-violet-electric hover:bg-violet-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Recherche...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Rechercher
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3 text-red-800">
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Modal de suivi de commande */}
        <OrderTrackingModal
          order={searchedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {/* Info Section */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardContent className="p-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-black-deep mb-3">
                    Comment trouver mon numéro de commande ?
                  </h2>
                  <p className="text-gray-600">
                    Trouvez facilement votre numéro de commande en suivant ces étapes simples
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                    <div className="w-12 h-12 bg-violet-electric rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h3 className="font-bold text-black-deep mb-2 text-lg">Email de confirmation</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Vérifiez votre boîte mail, vous avez reçu un email de confirmation avec votre numéro de commande juste après votre achat.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                    <div className="w-12 h-12 bg-violet-electric rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h3 className="font-bold text-black-deep mb-2 text-lg">Format du numéro</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Le numéro de commande commence par &quot;CMD-&quot; suivi de l&apos;année et d&apos;un numéro unique (ex: CMD-2025-001).
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                    <div className="w-12 h-12 bg-violet-electric rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h3 className="font-bold text-black-deep mb-2 text-lg">Pas de compte nécessaire</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Vous pouvez suivre votre commande simplement avec votre numéro de commande, sans créer de compte ni vous connecter.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
