'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-off-white via-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Conditions Générales de Vente
            </h1>
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12 prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">1. Informations légales</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Dénomination sociale :</strong> eJS MARKET<br />
                  <strong>Forme juridique :</strong> [À compléter]<br />
                  <strong>Capital social :</strong> [À compléter]<br />
                  <strong>SIRET :</strong> [À compléter]<br />
                  <strong>Siège social :</strong> [À compléter]<br />
                  <strong>Email :</strong> <a href="mailto:contact@ejsmarket.com" className="text-violet-electric hover:underline">contact@ejsmarket.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">2. Objet</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits réalisées sur le site eJS MARKET. 
                  Toute commande implique l&apos;acceptation sans réserve des présentes CGV.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">3. Produits</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous proposons des produits technologiques pour la maison et le jardin. Les caractéristiques des produits 
                  sont indiquées sur chaque fiche produit. Les photos sont non contractuelles. Les prix sont indiqués en euros 
                  toutes taxes comprises (TTC).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">4. Prix</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les prix de nos produits sont indiqués en euros TTC. Nous nous réservons le droit de modifier nos prix à tout moment, 
                  étant toutefois entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable à l&apos;acheteur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">5. Commande</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La commande devient définitive après validation du paiement. Une confirmation est envoyée par email. 
                  Nous nous réservons le droit de refuser toute commande pour motif légitime.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">6. Paiement</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le paiement s&apos;effectue par carte bancaire ou PayPal. Le paiement est sécurisé par nos prestataires certifiés. 
                  Le débit s&apos;effectue au moment de l&apos;expédition de la commande.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">7. Livraison</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les délais et frais de livraison sont indiqués lors de la commande. La livraison est effectuée à l&apos;adresse 
                  indiquée par le client. Pour plus de détails, consultez notre page <a href="/shipping" className="text-violet-electric hover:underline">Livraison</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">8. Droit de rétractation</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Conformément à la législation en vigueur, vous disposez d&apos;un délai de 14 jours pour exercer votre droit de rétractation 
                  sans avoir à justifier de motifs. Pour plus d&apos;informations, consultez notre page <a href="/returns" className="text-violet-electric hover:underline">Retours</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">9. Garantie</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. 
                  La garantie constructeur s&apos;applique selon les conditions de chaque fabricant.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">10. Responsabilité</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  eJS MARKET ne saurait être tenu responsable des dommages indirects consécutifs à l&apos;utilisation des produits vendus. 
                  Notre responsabilité est limitée au montant de la commande.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">11. Propriété intellectuelle</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tous les éléments du site sont la propriété de eJS MARKET. Toute reproduction est interdite sans autorisation écrite.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">12. Données personnelles</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vos données personnelles sont traitées conformément à notre <a href="/privacy" className="text-violet-electric hover:underline">Politique de Confidentialité</a> 
                  et au RGPD.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">13. Droit applicable</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes CGV sont régies par le droit français. Tout litige relève de la compétence exclusive des tribunaux français.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">14. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant ces CGV, contactez-nous à : 
                  <a href="mailto:legal@ejsmarket.com" className="text-violet-electric hover:underline"> legal@ejsmarket.com</a>
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

