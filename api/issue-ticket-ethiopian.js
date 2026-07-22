/**
 * /api/issue-ticket-ethiopian.js
 * ------------------------------------------------------------------------
 * Fonction serverless Vercel — Émission du billet Ethiopian Airlines (AirDocIssue).
 *
 * SÉPARÉE de reserve-ethiopian.js VOLONTAIREMENT : reserve-ethiopian.js ne crée que
 * le PNR (dossier de réservation), sans jamais émettre de billet automatiquement.
 * Cet endpoint doit être déclenché MANUELLEMENT par l'agence, une fois le paiement
 * du client réellement confirmé — pour éviter d'émettre (et de se faire facturer par
 * Ethiopian via le BSP) des billets non payés.
 *
 * Protection : nécessite ADMIN_SECRET (variable d'environnement Vercel), à définir
 * toi-même et à ne communiquer qu'à l'agence / au développeur.
 *
 * Variables d'environnement utilisées : les mêmes ET_NDC_* que les autres fonctions,
 * plus ADMIN_SECRET, GMAIL_USER, GMAIL_APP_PASSWORD.
 *
 * Appel (POST) :
 *   {
 *     "secret": "...",             // doit correspondre à ADMIN_SECRET
 *     "orderId": "REPBLW",         // PNR à faire émettre
 *     "totalAmount": "399.10",
 *     "currency": "USD",
 *     "passenger": { ptc, givenName, surname, email, phone, phoneCountryCode, issuingCountry }
 *   }
 *
 * Réponse JSON : { ticketNumbers, raw }
 */

const axios = require("axios");
const xml2js = require("xml2js");
const nodemailer = require("nodemailer");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const BASE_URL = process.env.ET_NDC_BASE_URL;
const RELATIVE = process.env.ET_NDC_RELATIVE;
const CLIENT = process.env.ET_NDC_CLIENT;
const SECRET = process.env.ET_NDC_SECRET;
const SCOPE = process.env.ET_NDC_SCOPE;
const AGENCY_NAME = process.env.ET_NDC_AGENCY_NAME || "Alamin Travels";
const IATA_NUMBER = process.env.ET_NDC_IATA_NUMBER;
const AGENCY_ID = process.env.ET_NDC_AGENCY_ID;
const FALLBACK_AGENCY_EMAIL = "reservations@alamintravel-dj.com";
const AGENCY_NOTIFY_EMAIL = process.env.GMAIL_USER || FALLBACK_AGENCY_EMAIL;

async function getAccessToken() {
  const url = `${BASE_URL}/${RELATIVE}/Auth`;
  const params = new URLSearchParams();
  params.append("Client", CLIENT);
  params.append("Secret", SECRET);
  params.append("Scope", SCOPE);
  params.append("grant_type", "client_credentials");

  const res = await axios.post(url, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data.access_token || res.data.token || res.data.accessToken;
}

function buildAirDocIssueXML({ orderId, totalAmount, currency, passenger }) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AirDocIssueRQ xmlns="http://www.iata.org/IATA/EDIST/2017.2" Version="2017.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Document>
        <Name>ETHIOPIAN AIRLINES NDC API</Name>
        <ReferenceVersion>1.0</ReferenceVersion>
    </Document>
    <Party>
        <Sender>
            <TravelAgencySender>
                <Name>${AGENCY_NAME}</Name>
                <IATA_Number>${IATA_NUMBER}</IATA_Number>
                <AgencyID Owner="ET">${AGENCY_ID}</AgencyID>
            </TravelAgencySender>
        </Sender>
        <Recipient>
            <ORA_Recipient>
                <AirlineID>ET</AirlineID>
                <Name>ETHIOPIAN AIRLINES</Name>
            </ORA_Recipient>
        </Recipient>
    </Party>
    <Query>
        <TicketDocQuantity>1</TicketDocQuantity>
        <TicketDocInfo>
            <PassengerReference>PAX001</PassengerReference>
            <OrderReference>
                <OrderID Owner="ET">${orderId}</OrderID>
                <BookingReference>
                    <ID>${orderId}</ID>
                    <AirlineID>ET</AirlineID>
                </BookingReference>
            </OrderReference>
            <Payments>
                <Payment>
                    <Type>CA</Type>
                    <Method>
                        <Cash/>
                    </Method>
                    <Amount Code="${currency}">${totalAmount}</Amount>
                    <Payer>
                        <ContactInfoRefs>CTC01</ContactInfoRefs>
                    </Payer>
                    <Order OrderID="${orderId}" Owner="ET"></Order>
                </Payment>
            </Payments>
        </TicketDocInfo>
        <DataLists>
            <PassengerList>
                <Passenger PassengerID="PAX001">
                    <PTC>${passenger.ptc || "ADT"}</PTC>
                    <Individual>
                        <GivenName>${passenger.givenName}</GivenName>
                        <Surname>${passenger.surname}</Surname>
                    </Individual>
                    <ContactInfoRef>CTC01</ContactInfoRef>
                </Passenger>
            </PassengerList>
            <ContactList>
                <ContactInformation ContactID="CTC01">
                    <PostalAddress>
                        <Label>HOME</Label>
                        <Street>Mohamed Kamil Road</Street>
                        <PostalCode>00000</PostalCode>
                        <CityName>Djibouti</CityName>
                        <CountrySubdivisionName>Salines Ouest</CountrySubdivisionName>
                        <CountryName>DJIBOUTI</CountryName>
                        <CountryCode>${passenger.issuingCountry || "DJ"}</CountryCode>
                    </PostalAddress>
                    <ContactProvided>
                        <Phone>
                            <Label>HOME</Label>
                            <CountryDialingCode>${passenger.phoneCountryCode || "253"}</CountryDialingCode>
                            <AreaCode>000</AreaCode>
                            <PhoneNumber>${passenger.phone}</PhoneNumber>
                        </Phone>
                    </ContactProvided>
                    <Individual>
                        <GivenName>${passenger.givenName}</GivenName>
                        <Surname>${passenger.surname}</Surname>
                    </Individual>
                </ContactInformation>
            </ContactList>
        </DataLists>
    </Query>
</AirDocIssueRQ>`;
}

async function issueTicket(token, { orderId, totalAmount, currency, passenger }) {
  const url = `${BASE_URL}/${RELATIVE}/AirDocIssue`;
  const xml = buildAirDocIssueXML({ orderId, totalAmount, currency, passenger });

  const response = await axios.post(url, xml, {
    headers: {
      "Content-Type": "application/xml",
      Accept: "application/xml",
      Authorization: `Bearer ${token}`,
    },
  });

  const parsed = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
    tagNameProcessors: [xml2js.processors.stripPrefix],
  });

  let ticketInfos = parsed.OrderViewRS?.Response?.TicketDocInfos?.TicketDocInfo;
  if (!ticketInfos) return { ticketNumbers: [], raw: response.data };
  if (!Array.isArray(ticketInfos)) ticketInfos = [ticketInfos];

  const ticketNumbers = ticketInfos.map((t) => {
    const nbr = t.TicketDocument?.TicketDocNbr;
    return typeof nbr === "object" ? nbr._ : nbr;
  }).filter(Boolean);

  return { ticketNumbers, raw: response.data };
}

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

async function buildTicketPDF({ orderId, ticketNumbers, passenger, totalAmount, currency }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.043, 0.122, 0.227);
  const green = rgb(0.11, 0.36, 0.13);

  let y = 800;
  const left = 50;
  function line(text, { size = 11, useFont = font, color = navy, gap = 18 } = {}) {
    page.drawText(text, { x: left, y, size, font: useFont, color });
    y -= gap;
  }

  line("ALAMIN TOURISM & TRAVEL", { size: 18, useFont: bold, gap: 26 });
  line("Billet émis", { size: 15, useFont: bold, color: green, gap: 26 });
  line(`PNR : ${orderId}`, { useFont: bold, gap: 18 });
  line(`N° de billet : ${ticketNumbers.join(", ")}`, { useFont: bold, gap: 22 });
  line(`Passager : ${passenger.givenName || ""} ${passenger.surname || ""}`.trim(), { gap: 18 });
  line(`Montant réglé : ${totalAmount} ${currency}`, { gap: 22 });
  line("Merci de votre confiance. Bon voyage !", { size: 10, gap: 16 });
  line("Contact : WhatsApp +253 77 646 406", { size: 10 });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

async function sendTicketIssuedEmail({ orderId, ticketNumbers, passenger, totalAmount, currency }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email non envoyé (billet émis) : GMAIL_USER / GMAIL_APP_PASSWORD non configurés.");
    return;
  }
  let pdfBuffer = null;
  try {
    pdfBuffer = await buildTicketPDF({ orderId, ticketNumbers, passenger, totalAmount, currency });
  } catch (e) {
    console.error("Erreur génération PDF billet:", e.message);
  }
  const attachments = pdfBuffer
    ? [{ filename: `billet-${orderId}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
    : [];

  const html = `
    <div style="font-family: Arial, sans-serif; color:#0B1F3A;">
      <h2 style="color:#1B5E20;">Votre billet a été émis !</h2>
      <p>Bonjour ${passenger.givenName || ""},</p>
      <p><strong>PNR : ${orderId}</strong><br/><strong>N° de billet : ${ticketNumbers.join(", ")}</strong></p>
      <p>Montant réglé : ${totalAmount} ${currency}</p>
      <p>Vous trouverez votre billet en pièce jointe (PDF). Bon voyage avec Ethiopian Airlines !</p>
      <p style="margin-top:24px;">Alamin Tourism & Travel<br/>WhatsApp : +253 77 646 406</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Alamin Travels" <${process.env.GMAIL_USER}>`,
      to: passenger.email || AGENCY_NOTIFY_EMAIL,
      subject: `Votre billet est émis - PNR ${orderId}`,
      html,
      attachments,
    });
  } catch (e) {
    console.error("Erreur envoi email billet émis:", e.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée, utiliser POST" });

  const { secret, orderId, totalAmount, currency, passenger } = req.body || {};

  if (!process.env.ADMIN_SECRET) {
    return res.status(500).json({ error: "ADMIN_SECRET non configuré sur le serveur — ajoute cette variable d'environnement sur Vercel avant d'utiliser cet outil." });
  }
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Mot de passe incorrect." });
  }
  if (!orderId || !totalAmount || !currency || !passenger || !passenger.givenName || !passenger.surname) {
    return res.status(400).json({ error: "Champs requis manquants : orderId, totalAmount, currency, passenger (givenName, surname, phone, email)" });
  }

  try {
    const token = await getAccessToken();
    const issued = await issueTicket(token, { orderId, totalAmount, currency, passenger });

    if (issued.ticketNumbers.length) {
      try {
        await sendTicketIssuedEmail({ orderId, ticketNumbers: issued.ticketNumbers, passenger, totalAmount, currency });
      } catch (emailErr) {
        console.error("Erreur envoi email billet émis:", emailErr.message);
      }
    }

    return res.status(200).json({ ticketNumbers: issued.ticketNumbers, raw: issued.raw });
  } catch (err) {
    console.error("Ethiopian NDC AIRDOCISSUE error:", err.response?.data || err.message);
    return res.status(502).json({ error: "Erreur lors de l'émission du billet", details: err.response?.data || err.message });
  }
};
