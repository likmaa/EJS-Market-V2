# 🚀 Guide de Déploiement Coolify

Ce guide explique comment déployer l'application sur une instance Coolify.

## 📦 Étape 1 : GitHub

Assurez-vous que votre code est poussé sur GitHub. Voir [`INSTRUCTIONS_GITHUB.md`](./INSTRUCTIONS_GITHUB.md) pour plus de détails.

## ☁️ Étape 2 : Coolify

1. Connectez-vous à votre instance Coolify.
2. Créez un nouveau projet (ex: "EJS Market").
3. Ajoutez une nouvelle application en sélectionnant votre dépôt GitHub.
4. Coolify détectera automatiquement le **Dockerfile** à la racine du projet.
5. Configurez le domaine : `https://ejs.ticmiton.com`.
6. Configurez le port de destination : `3000`.

## 🔑 Étape 3 : Variables d'Environnement

Configurez les variables suivantes dans l'onglet "Environment Variables" de Coolify :

- `DATABASE_URL` : Votre URL PostgreSQL (ex: Neon).
- `NEXTAUTH_URL` : `https://ejs.ticmiton.com`
- `NEXTAUTH_SECRET` : Un secret fort (généré avec `openssl rand -base64 32`).
- `NEXT_PUBLIC_APP_URL` : `https://ejs.ticmiton.com`
- `NODE_ENV` : `production`

## 🏁 Étape 4 : Déploiement

1. Cliquez sur **Deploy**.
2. Une fois le build terminé, accédez au terminal de l'application (ou utilisez un script local).
3. Exécutez les migrations : `npx prisma migrate deploy`
4. Seedez les données : `npm run db:seed`

---

## ✅ Checklist Rapide

- [ ] Code poussé sur GitHub.
- [ ] Application créée dans Coolify.
- [ ] Dockerfile détecté et valide.
- [ ] Variables d'environnement configurées.
- [ ] Domaine `ejs.ticmiton.com` configuré.
- [ ] Migrations et Seed effectués.
- [ ] Site accessible en HTTPS.

---

**Bon déploiement ! 🚀**
