import nodemailer from 'nodemailer';

type B2BStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      '[email] SMTP non configuré (SMTP_HOST/SMTP_USER/SMTP_PASS manquants). Les emails sont loggés en console uniquement.',
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendB2BStatusEmail(options: {
  to: string;
  companyName: string;
  status: B2BStatus;
}) {
  const from = process.env.SMTP_FROM || 'no-reply@ejs-market.com';
  const subject =
    options.status === 'APPROVED'
      ? 'Votre demande B2B a été approuvée'
      : options.status === 'REJECTED'
      ? 'Mise à jour de votre demande B2B'
      : 'Réception de votre demande B2B';

  const text =
    options.status === 'APPROVED'
      ? `Bonjour,\n\nVotre demande B2B pour ${options.companyName} a été approuvée. Vous pouvez maintenant vous connecter et passer des commandes en gros.\n\nL'équipe eJS MARKET`
      : options.status === 'REJECTED'
      ? `Bonjour,\n\nVotre demande B2B pour ${options.companyName} a été étudiée mais n'a pas pu être approuvée pour le moment.\n\nL'équipe eJS MARKET`
      : `Bonjour,\n\nNous avons bien reçu votre demande B2B pour ${options.companyName}. Notre équipe va l'étudier et reviendra vers vous rapidement.\n\nL'équipe eJS MARKET`;

  const transporter = getTransport();

  // En développement ou sans SMTP, on log simplement le contenu de l'email
  if (!transporter) {
    console.log('[email:B2B]', { to: options.to, from, subject, text });
    return;
  }

  await transporter.sendMail({
    from,
    to: options.to,
    subject,
    text,
  });
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
      '[email:ADMIN_B2B] Nouvelle demande B2B (ADMIN_NOTIFICATION_EMAIL non configuré)',
      payload,
    );
    return;
  }

  const transporter = getTransport();
  const subject = `Nouvelle demande B2B : ${payload.companyName}`;
  const text = `Une nouvelle demande B2B a été reçue :

Entreprise : ${payload.companyName}
Email      : ${payload.email}
Téléphone  : ${payload.phone}
TVA        : ${payload.vatNumber}
Secteur    : ${payload.sector}
Volume     : ${payload.annualVolume}
`;

  if (!transporter) {
    console.log('[email:ADMIN_B2B]', { to: adminEmail, subject, text });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@ejs-market.com',
    to: adminEmail,
    subject,
    text,
  });
}


