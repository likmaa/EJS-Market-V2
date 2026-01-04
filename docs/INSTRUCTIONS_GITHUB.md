# 📋 Guide GitHub - Push et Configuration

## 🐙 Créer le Dépôt GitHub

1. Allez sur https://github.com/new
2. **Repository name** : `EJS-Market` (ou votre nom)
3. **Description** : "E-commerce platform for electronics and garden products"
4. Choisissez **Public** ou **Private**
5. **NE COCHEZ PAS** "Add a README file"
6. Cliquez sur **"Create repository"**

## 🔗 Connecter et Pousser le Code

### Option 1 : HTTPS avec Token (Recommandé)

1. **Créer un token GitHub** :
   - https://github.com/settings/tokens
   - **Generate new token (classic)**
   - Cochez **"repo"**
   - **COPIEZ LE TOKEN**

2. **Pousser** :
```bash
git remote add origin https://github.com/VOTRE_USERNAME/EJS-Market.git
git branch -M main
git push -u origin main
# Username: VOTRE_USERNAME
# Password: VOTRE_TOKEN
```

### Option 2 : SSH (Plus sécurisé)

1. **Créer une clé SSH** :
```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
cat ~/.ssh/id_ed25519.pub
```

2. **Ajouter à GitHub** :
   - https://github.com/settings/keys
   - **New SSH key** → Coller la clé

3. **Pousser** :
```bash
git remote add origin git@github.com:VOTRE_USERNAME/EJS-Market.git
git branch -M main
git push -u origin main
```

### Option 3 : GitHub CLI

```bash
brew install gh
gh auth login
git push -u origin main
```

---

Pour le déploiement Vercel, voir [`VERCEL.md`](./VERCEL.md)

