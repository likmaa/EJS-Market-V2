type B2BStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export async function sendB2BStatusEmail(options: {
  to: string;
  companyName: string;
  status: B2BStatus;
}) {
  // Pour l'instant, on ne fait qu'écrire dans les logs serveur.
  // Ainsi, pas besoin de dépendance "nodemailer" tant que l'envoi réel n'est pas configuré.
  console.log('[email:B2B_STATUS]', options);
}

export async function notifyAdminNewB2BRequest(payload: {
  companyName: string;
  email: string;
  phone: string;
  vatNumber: string;
  sector: string;
  annualVolume: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    console.log(
      '[email:ADMIN_B2B] Nouvelle demande B2B (ADMIN_NOTIFICATION_EMAIL non configuré, log uniquement)',
      payload,
    );
    return;
  }

  console.log('[email:ADMIN_B2B]', { to: adminEmail, payload });
}


