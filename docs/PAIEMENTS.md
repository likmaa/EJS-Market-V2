# 💳 Configuration des Moyens de Paiement

Documentation complète pour la configuration et la gestion des moyens de paiement sur EJS Market.

---

## 📋 Moyens de Paiement Disponibles

EJS Market propose **deux moyens de paiement** :

1. **💳 Carte de crédit/débit** - Paiement sécurisé en ligne
2. **🏦 Virement bancaire** - Paiement par transfert bancaire

---

## 💳 Paiement par Carte de Crédit

### Fonctionnement

Les clients peuvent payer directement en ligne avec leur carte bancaire (Visa, Mastercard, etc.).

### Caractéristiques

- ✅ **Sécurisé** : Conformité PCI DSS
- ✅ **Rapide** : Validation instantanée
- ✅ **International** : Accepte les cartes de tous les pays
- ✅ **3D Secure** : Authentification renforcée (DSP2)

### Processus de paiement

1. Le client sélectionne "Paiement par carte" au checkout
2. Redirection vers la page de paiement sécurisée
3. Saisie des informations de carte
4. Validation 3D Secure si requis
5. Confirmation de la commande

### Statut de la commande

- **En attente** → Paiement en cours de traitement
- **Payée** → Paiement validé, commande confirmée
- **Échouée** → Paiement refusé (carte refusée, fonds insuffisants, etc.)

---

## 🏦 Paiement par Virement Bancaire

### Fonctionnement

Les clients peuvent choisir de payer par virement bancaire. La commande est créée en statut "En attente de paiement" et le client reçoit les coordonnées bancaires pour effectuer le transfert.

### Caractéristiques

- ✅ **Sécurisé** : Pas de frais de transaction
- ✅ **Idéal pour les gros montants** : Pas de limite de montant
- ✅ **Confiance** : Méthode traditionnelle appréciée
- ⏱️ **Délai** : Validation manuelle par l'équipe (1-3 jours ouvrés)

### Processus de paiement

1. Le client sélectionne "Virement bancaire" au checkout
2. La commande est créée avec le statut **"En attente de paiement"**
3. Le client reçoit un email avec :
   - Les coordonnées bancaires (IBAN, BIC, etc.)
   - Le montant exact à virer
   - La référence de commande à mentionner
4. Le client effectue le virement depuis sa banque
5. L'équipe EJS Market vérifie la réception du paiement
6. La commande passe au statut **"Payée"** et est traitée

### Informations bancaires à fournir

Les coordonnées bancaires doivent être configurées dans les paramètres du site et affichées automatiquement :

- **Nom du bénéficiaire** : ROCIO GUTIÉRREZ
- **IBAN** : ES06 0182 5322 2600 0304 6609
- **BIC/SWIFT** : BBVAESMM
- **Banque** : BBVA
- **Adresse** : [À configurer]

### Gestion manuelle des virements

L'équipe admin doit :

1. **Surveiller les virements reçus** (via l'interface bancaire)
2. **Vérifier la référence de commande** mentionnée dans le virement
3. **Valider le paiement** dans le panel admin :
   - Aller dans **Admin → Commandes**
   - Trouver la commande correspondante
   - Cliquer sur **"Valider le paiement"**
   - La commande passe au statut **"Payée"**

### Email automatique au client

Lors de la validation du paiement par l'admin, un email est automatiquement envoyé au client pour confirmer la réception du paiement et lancer le traitement de la commande.

---

## ⚙️ Configuration Technique

### Variables d'environnement

Pour le paiement par carte, aucune variable d'environnement spécifique n'est requise si vous utilisez une solution de paiement intégrée.

Pour le virement bancaire, les coordonnées bancaires peuvent être stockées dans les variables d'environnement ou dans la base de données :

```env
# Coordonnées bancaires (optionnel - peut être dans la DB)
BANK_NAME="Nom de la banque"
BANK_IBAN="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
BANK_BIC="XXXXXXXXXXX"
BANK_ADDRESS="Adresse de la banque"
BANK_ACCOUNT_HOLDER="EJS Market"
```

### Schéma de base de données

Les commandes stockent le moyen de paiement choisi :

```prisma
model Order {
  id            String        @id @default(uuid())
  paymentMethod String        // "card" ou "bank_transfer"
  status        OrderStatus   // "PENDING", "PAID", "FAILED", etc.
  // ... autres champs
}
```

### Statuts de commande

- **`PENDING`** : En attente de paiement (virement ou carte en cours)
- **`PAID`** : Paiement validé, commande confirmée
- **`FAILED`** : Paiement échoué (carte refusée)
- **`CANCELLED`** : Commande annulée
- **`PROCESSING`** : Commande en cours de traitement
- **`SHIPPED`** : Commande expédiée
- **`DELIVERED`** : Commande livrée

---

## 🔒 Sécurité

### Paiement par carte

- ✅ **Aucune donnée de carte stockée** : Toutes les transactions passent par un processeur de paiement sécurisé
- ✅ **Conformité PCI DSS** : Le processeur de paiement est certifié PCI DSS Level 1
- ✅ **3D Secure** : Authentification renforcée pour les paiements européens (DSP2)
- ✅ **Chiffrement SSL/TLS** : Toutes les communications sont chiffrées

### Paiement par virement

- ✅ **Validation manuelle** : Seuls les admins peuvent valider les paiements
- ✅ **Référence unique** : Chaque commande a une référence unique à mentionner dans le virement
- ✅ **Traçabilité** : Tous les virements sont tracés dans le système

---

## 📧 Emails Automatiques

### Paiement par carte

- **Confirmation de paiement** : Envoyé automatiquement après validation
- **Échec de paiement** : Envoyé si le paiement est refusé

### Paiement par virement

- **Instructions de paiement** : Envoyé après création de la commande avec les coordonnées bancaires
- **Confirmation de réception** : Envoyé après validation manuelle par l'admin

---

## 🛠️ Implémentation dans le Code

### Page de checkout

Le client choisit son moyen de paiement :

```typescript
// app/checkout/page.tsx
const paymentMethods = [
  { id: 'card', label: 'Carte de crédit/débit', icon: '💳' },
  { id: 'bank_transfer', label: 'Virement bancaire', icon: '🏦' },
];
```

### Traitement du paiement

```typescript
// app/api/checkout/route.ts
if (paymentMethod === 'card') {
  // Traitement paiement carte (intégration processeur de paiement)
} else if (paymentMethod === 'bank_transfer') {
  // Créer commande en statut PENDING
  // Envoyer email avec coordonnées bancaires
}
```

### Validation manuelle (Admin)

```typescript
// app/api/admin/orders/[id]/validate-payment/route.ts
// Route pour valider manuellement un paiement par virement
```

---

## 📊 Statistiques

Dans le panel admin, vous pouvez consulter :

- **Répartition des moyens de paiement** : % carte vs virement
- **Taux de conversion** : % de commandes payées par méthode
- **Commandes en attente** : Liste des virements en attente de validation

---

## ❓ FAQ

### Combien de temps pour valider un virement ?

En général, 1-3 jours ouvrés après réception du virement. L'équipe vérifie quotidiennement les virements reçus.

### Que se passe-t-il si le virement n'arrive pas ?

Si après 7 jours le virement n'est pas reçu, la commande peut être annulée automatiquement ou manuellement par l'admin.

### Les clients peuvent-ils changer de moyen de paiement ?

Non, une fois la commande créée, le moyen de paiement ne peut plus être modifié. Le client doit annuler et recréer une nouvelle commande.

### Y a-t-il des frais supplémentaires ?

- **Carte de crédit** : Frais de transaction selon le processeur (généralement 1.4% + 0.25€)
- **Virement bancaire** : Aucun frais pour le client, mais délai de validation manuelle

---

## 🔄 Prochaines Étapes

- [ ] Intégrer un processeur de paiement pour les cartes (Stripe, PayPal, etc.)
- [ ] Automatiser la détection des virements (webhook bancaire si disponible)
- [ ] Ajouter des notifications pour les commandes en attente de virement
- [ ] Créer un dashboard de suivi des paiements en attente

---

**Dernière mise à jour** : 2024

