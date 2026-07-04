// /api/reserve.js
// Reçoit une demande de réservation du client et notifie l'agence par email + WhatsApp.
// Ne crée PAS de commande Duffel automatiquement (pas de paiement en ligne) :
// c'est vous qui finalisez la réservation manuellement (dans Duffel ou par téléphone).
//
// Variables d'environnement à configurer dans Vercel :
//   GMAIL_USER            (ex: contact@alamintravel-dj.com ou une adresse gmail)
//   GMAIL_APP_PASSWORD    (mot de passe d'application Gmail, PAS le mot de passe du compte)
//   NOTIFY_EMAIL          (adresse qui reçoit les demandes, peut être = GMAIL_USER)
//   WHATSAPP_PHONE        (votre numéro WhatsApp, format international sans + ex: 25377xxxxxx)
//   CALLMEBOT_APIKEY      (clé obtenue via CallMeBot, voir README)

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { offer, customerName, customerPhone, customerEmail, notes } = req.body || {};

  if (!offer || !customerName || !customerPhone) {
    return res.status(400).json({ error: 'offer, customerName et customerPhone sont requis' });
  }

  const firstSlice = offer.slices?.[0];
  const summary = firstSlice
    ? `${firstSlice.origin} -> ${firstSlice.destination}, départ ${firstSlice.segments?.[0]?.departing_at || ''}`
    : 'Vol sélectionné';

  const message =
    `Nouvelle demande de réservation - Alamin Travel\n` +
    `Client: ${customerName}\n` +
    `Tél: ${customerPhone}\n` +
    `Email: ${customerEmail || '-'}\n` +
    `Vol: ${summary}\n` +
    `Compagnie: ${offer.owner || '-'}\n` +
    `Prix: ${offer.total_amount || '-'} ${offer.total_currency || ''}\n` +
    `Notes: ${notes || '-'}\n` +
    `Offer ID (Duffel): ${offer.id || '-'}`;

  const results = {};

  // --- Email via Gmail ---
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: `Nouvelle demande de réservation - ${customerName}`,
      text: message,
    });

    results.email = 'ok';
  } catch (err) {
    console.error('Erreur email:', err);
    results.email = 'erreur';
  }

  // --- WhatsApp via CallMeBot ---
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.WHATSAPP_PHONE}&text=${encodeURIComponent(
      message
    )}&apikey=${process.env.CALLMEBOT_APIKEY}`;
    await fetch(url);
    results.whatsapp = 'ok';
  } catch (err) {
    console.error('Erreur WhatsApp:', err);
    results.whatsapp = 'erreur';
  }

  return res.status(200).json({ success: true, results });
}
