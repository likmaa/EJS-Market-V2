#!/usr/bin/env tsx
/**
 * Script pour tester la connexion à la base de données depuis Vercel
 * 
 * Usage:
 *   npx tsx scripts/test-vercel-db.ts
 */

const VERCEL_URL = process.env.VERCEL_URL || 'https://ejs-market-181a.vercel.app';

async function testVercelConnection() {
  console.log('🔍 Test de la connexion Vercel à la base de données...\n');
  console.log(`📍 URL Vercel: ${VERCEL_URL}\n`);

  try {
    // Test 1: Test de la base de données
    console.log('1️⃣ Test de la connexion à la base de données...');
    const dbResponse = await fetch(`${VERCEL_URL}/api/test-db`);
    const dbData = await dbResponse.json();

    if (dbData.success) {
      console.log('✅ Connexion à la base de données réussie !');
      console.log(`   📊 Utilisateurs: ${dbData.userCount}`);
      console.log(`   👤 Admin existe: ${dbData.adminExists ? 'Oui' : 'Non'}`);
      if (dbData.adminUser) {
        console.log(`   📧 Email admin: ${dbData.adminUser.email}`);
        console.log(`   🔑 Rôle: ${dbData.adminUser.role}`);
      }
      console.log(`   🔗 Database URL: ${dbData.databaseUrl}`);
    } else {
      console.log('❌ Échec de la connexion à la base de données');
      console.log(`   Erreur: ${dbData.error}`);
      if (dbData.stack) {
        console.log(`   Stack: ${dbData.stack.substring(0, 200)}...`);
      }
      
      // Vérifier si l'ancienne URL de base de données est encore utilisée
      if (dbData.error?.includes('supabase.com')) {
        console.log('\n⚠️  PROBLÈME DÉTECTÉ:');
        console.log('   La DATABASE_URL sur Vercel pointe encore vers l\'ancienne base Supabase');
        console.log('   → Va sur Vercel → Settings → Environment Variables');
        console.log('   → Supprime DATABASE_URL et recrée-la avec la connection string Neon');
      }
      
      if (dbData.error?.includes('Authentication failed')) {
        console.log('\n⚠️  PROBLÈME DÉTECTÉ:');
        console.log('   Échec d\'authentification contre la base de données');
        console.log('   → Vérifie que la connection string Neon est correcte');
        console.log('   → Vérifie que le mot de passe est correct');
      }
    }

    console.log('\n');

    // Test 2: Test de l'authentification
    console.log('2️⃣ Test de l\'authentification...');
    const authResponse = await fetch(`${VERCEL_URL}/api/test-auth`);
    const authData = await authResponse.json();

    if (authResponse.ok && authData.authenticated) {
      console.log('✅ Authentification fonctionnelle');
      console.log(`   👤 Utilisateur: ${authData.user?.email || 'Non connecté'}`);
    } else {
      console.log('⚠️  Authentification non testée (nécessite une session)');
    }

    console.log('\n');

    // Résumé
    if (dbData.success) {
      console.log('✅ RÉSULTAT: Vercel est connecté à la base de données Neon !');
      console.log('\n📋 Prochaines étapes:');
      console.log('   1. Teste la connexion admin: https://ejs-market-181a.vercel.app/login');
      console.log('   2. Email: admin@ejsmarket.com');
      console.log('   3. Mot de passe: Admin123!');
    } else {
      console.log('❌ RÉSULTAT: Vercel n\'est PAS connecté à la base de données');
      console.log('\n📋 Actions à faire:');
      console.log('   1. Va sur Vercel → Settings → Environment Variables');
      console.log('   2. Vérifie que DATABASE_URL contient "neon.tech" (et plus aucune référence à Supabase)');
      console.log('   3. Si nécessaire, supprime et recrée DATABASE_URL');
      console.log('   4. Redéploie sur Vercel');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  }
}

testVercelConnection();

