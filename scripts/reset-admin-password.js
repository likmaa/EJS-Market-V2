

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@ejsmarket.com';
  const newPassword = process.env.NEW_ADMIN_PASSWORD;

  if (!newPassword) {
    throw new Error(
      'Veuillez définir la variable d’environnement NEW_ADMIN_PASSWORD avant de lancer le script.'
    );
  }

  console.log(`🔐 Réinitialisation du mot de passe pour : ${email}`);

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(`Utilisateur introuvable avec l'email : ${email}`);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.users.update({
    where: { email },
    data: {
      passwordHash,
      updatedAt: new Date(),
    },
  });

  console.log('✅ Mot de passe mis à jour avec succès.');
}

main()
  .catch((err) => {
    console.error('❌ Erreur lors de la réinitialisation du mot de passe :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


