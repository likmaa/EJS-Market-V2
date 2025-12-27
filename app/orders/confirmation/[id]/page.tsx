'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Pour des raisons de simplicité, on utilise l'API admin si l'utilisateur est admin
                // ou on pourrait créer une API /api/orders/[id] spécifique pour l'utilisateur.
                // Ici, on va simuler ou appeler une API (à créer si besoin)
                const response = await fetch(`/api/admin/orders/${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data.order);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la commande:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-off-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-electric"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white py-12">
            <div className="container mx-auto px-4 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-black-deep mb-4">Commande Reçue !</h1>
                        <p className="text-gray-600 text-lg">
                            Merci pour votre confiance. Votre commande <span className="font-bold text-violet-electric">{orderId}</span> est enregistrée.
                        </p>
                    </motion.div>

                    <Card className="mb-8 border-violet-electric/20 border-2">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-black-deep mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Coordonnées pour le virement
                            </h2>

                            <div className="bg-violet-soft/30 rounded-xl p-6 space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">Bénéficiaire :</span>
                                    <span className="md:col-span-2 font-bold text-black-deep">EJS MARKET EUROPE SL</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">IBAN :</span>
                                    <span className="md:col-span-2 font-mono font-bold text-black-deep text-lg">ES76 1234 5678 9012 3456 7890</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">BIC / SWIFT :</span>
                                    <span className="md:col-span-2 font-mono font-bold text-black-deep">BCIESMMXXXX</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">Montant :</span>
                                    <span className="md:col-span-2 font-bold text-violet-electric text-xl">
                                        {order ? formatPrice(order.totalTTC) : '...'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">Référence :</span>
                                    <span className="md:col-span-2 font-bold bg-violet-electric text-white px-3 py-1 rounded inline-block w-fit">
                                        {orderId}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 italic">
                                <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-amber-800">
                                    Votre commande sera traitée dès réception de votre virement (généralement 24h à 48h).
                                    N'oubliez pas d'indiquer la <strong>référence de commande</strong> dans le libellé de votre virement.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/profile/orders">
                            <Button variant="outline" size="lg" className="w-full md:w-auto">Mes commandes</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="primary" size="lg" className="w-full md:w-auto">Retour à l'accueil</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
