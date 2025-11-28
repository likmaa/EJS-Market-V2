'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { CartIcon, RevenueIcon, BoxIcon } from '@/components/admin/AdminIcons';

// Données mockées - à remplacer par des appels API
const stats = {
  revenue: {
    today: 3420,
    week: 24500,
    month: 125430,
    year: 1450000,
  },
  orders: {
    today: 15,
    week: 98,
    month: 342,
    year: 4200,
  },
  topProducts: [
    { name: 'iPhone 15 Pro', sales: 45, revenue: 53955 },
    { name: 'PlayStation 5', sales: 32, revenue: 15968 },
    { name: 'Robot Tondeuse', sales: 18, revenue: 44982 },
  ],
  recentActivity: [
    { type: 'order', message: 'Nouvelle commande #ORD-1005', time: 'Il y a 5 min' },
    { type: 'payment', message: 'Paiement reçu pour #ORD-1004', time: 'Il y a 12 min' },
    { type: 'product', message: 'Produit "MacBook Pro" ajouté', time: 'Il y a 1h' },
    { type: 'order', message: 'Commande #ORD-1003 expédiée', time: 'Il y a 2h' },
  ],
};

export default function AdminStatsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-gray-600 mt-1">Analyse détaillée de votre activité</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Aujourd'hui</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.today / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            <p className="text-xs text-green-600 mt-1">+8% vs hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Cette Semaine</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.week / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            <p className="text-xs text-green-600 mt-1">+12% vs semaine dernière</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Ce Mois</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.month / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            <p className="text-xs text-green-600 mt-1">+15% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Cette Année</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.year / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            <p className="text-xs text-green-600 mt-1">+22% vs année dernière</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Commandes Aujourd'hui</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.today}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Commandes Cette Semaine</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.week}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Commandes Ce Mois</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.month}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Produits les Plus Vendus
            </h3>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-violet-electric text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(product.revenue / 100).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activité Récente
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'order' && <CartIcon className="w-4 h-4" />}
                    {activity.type === 'payment' && <RevenueIcon className="w-4 h-4" />}
                    {activity.type === 'product' && <BoxIcon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

