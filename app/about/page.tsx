'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function AboutPage() {
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Qualité Garantie',
      description: 'Nous sélectionnons uniquement les produits des meilleures marques pour garantir une qualité exceptionnelle et une durabilité optimale.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Service Client 24/7',
      description: 'Notre équipe est disponible à tout moment pour vous accompagner dans vos choix et répondre à vos questions.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Livraison Rapide',
      description: 'Nous garantissons une livraison rapide et sécurisée dans toute l\'Europe avec un suivi en temps réel de vos commandes.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Paiement Sécurisé',
      description: 'Toutes vos transactions sont protégées par les dernières technologies de cryptage pour une sécurité maximale.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Clients satisfaits' },
    { number: '10K+', label: 'Produits disponibles' },
    { number: '25+', label: 'Pays livrés' },
    { number: '4.8/5', label: 'Note moyenne' },
  ];

  const features = [
    {
      title: 'Deux Univers Complémentaires',
      description: 'Nous proposons une sélection unique de produits technologiques pour la maison et d\'équipements de jardinage intelligents. De l\'iPhone à la robot tondeuse, nous couvrons tous vos besoins.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    },
    {
      title: 'Sélection Curatée',
      description: 'Chaque produit est soigneusement sélectionné par notre équipe d\'experts pour garantir qualité, innovation et durabilité. Nous ne proposons que le meilleur du marché.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    },
    {
      title: 'Partenariats Privilégiés',
      description: 'Nous travaillons directement avec les plus grandes marques : Apple, Sony, Husqvarna, STIHL et bien d\'autres pour vous offrir des prix compétitifs et des produits authentiques.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-off-white via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-electric via-purple-600 to-indigo-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              Bienvenue sur eJS MARKET
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Votre destination privilégiée pour la technologie et le jardinage intelligent. 
              Nous connectons l'innovation à votre quotidien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-white text-violet-electric hover:bg-gray-100 px-8 py-4 text-lg">
                  Découvrir nos produits
                </Button>
              </Link>
              <Link href="/be-pro">
                <Button variant="secondary" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 text-lg">
                  Devenir partenaire
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-black-deep mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  eJS MARKET est né d'une vision simple : rendre accessible les meilleures technologies 
                  pour la maison et le jardin au plus grand nombre. Fondée par des passionnés d'innovation, 
                  notre plateforme a rapidement évolué pour devenir une référence en Europe.
                </p>
                <p>
                  Nous croyons fermement que la technologie doit servir à améliorer notre qualité de vie, 
                  que ce soit dans nos intérieurs avec les dernières innovations Apple et Sony, ou dans 
                  nos jardins avec les robots tondeuses et équipements intelligents des plus grandes marques.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers de compter des milliers de clients satisfaits et de 
                  travailler avec les leaders mondiaux de leurs secteurs respectifs.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                alt="Équipe eJS MARKET"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-violet-electric mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-black-deep mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-gray-200 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-violet-electric/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-violet-electric">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-black-deep mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Atouts */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-black-deep mb-4">
              Pourquoi Choisir eJS MARKET ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce qui nous distingue et fait de nous votre meilleur choix
            </p>
          </motion.div>
          <div className="space-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-black-deep mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-electric to-purple-600">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Explorez notre catalogue de produits soigneusement sélectionnés et découvrez 
              comment la technologie peut transformer votre quotidien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-white text-violet-electric hover:bg-gray-100 px-8 py-4 text-lg">
                  Voir la boutique
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="secondary" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 text-lg">
                  Suivre ma commande
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

