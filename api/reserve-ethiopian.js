/**
 * /api/reserve-ethiopian.js
 * ------------------------------------------------------------------------
 * Fonction serverless Vercel — Réservation via l'API NDC directe
 * d'Ethiopian Airlines (remplace Duffel pour cette compagnie).
 *
 * Utilise les mêmes variables d'environnement que search-flights-ethiopian.js
 * (voir ce fichier pour la liste complète).
 *
 * Appel depuis le frontend (POST) :
 *   {
 *     "responseId": "...",       // reçu de search-flights-ethiopian
 *     "offerId": "...",
 *     "offerItemId": "...",
 *     "totalAmount": "52377",
 *     "currency": "ETB",
 *     "passenger": {
 *        "ptc": "ADT",
 *        "birthdate": "1990-05-12",
 *        "gender": "Male",
 *        "title": "MR",
 *        "givenName": "Amin",
 *        "surname": "Moussa",
 *        "idNumber": "P1234567",
 *        "idType": "P",
 *        "issuingCountry": "DJ",
 *        "citizenshipCountry": "DJ",
 *        "issueDate": "2020-01-01",
 *        "expiryDate": "2030-01-01",
 *        "email": "client@example.com",   // OPTIONNEL — email agence utilisé en secours
 *        "phone": "77123456",             // REQUIS
 *        "phoneCountryCode": "253"
 *     }
 *   }
 *
 * Réponse JSON : { orderId, raw }
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

const PAYMENT_METHOD_LABELS = {
  agency_cash: "Paiement en espèces à l'agence",
  credit_card: "Carte de crédit (paiement à finaliser avec l'agence — non traité en ligne pour le moment)",
  mobile_money: "Mobile Money - D-Money / Waafi (paiement à finaliser avec l'agence — non traité en ligne pour le moment)",
};

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

// Extrait le résumé du vol confirmé directement depuis la réponse OrderCreate d'Ethiopian
// (plus fiable que les données de recherche initiales, puisque c'est la réservation confirmée).
function extractFlightSummary(parsedOrderView) {
  try {
    const dataLists = parsedOrderView.OrderViewRS?.Response?.DataLists || parsedOrderView.OrderViewRS?.DataLists;
    let segments = dataLists?.FlightSegmentList?.FlightSegment;
    if (!segments) return [];
    if (!Array.isArray(segments)) segments = [segments];
    return segments.map((seg) => ({
      depAirport: seg.Departure?.AirportCode,
      depDate: seg.Departure?.Date,
      depTime: seg.Departure?.Time,
      arrAirport: seg.Arrival?.AirportCode,
      arrDate: seg.Arrival?.Date,
      arrTime: seg.Arrival?.Time,
      flightNumber: seg.MarketingCarrier?.FlightNumber,
    }));
  } catch (e) {
    return [];
  }
}

function buildFlightLinesHtml(segments) {
  if (!segments.length) return "<p>Détails du vol à confirmer avec l'agence.</p>";
  return segments.map((s) => `
    <p style="margin:4px 0;">
      <strong>ET${s.flightNumber || ""}</strong> — ${s.depAirport} → ${s.arrAirport}<br/>
      Départ : ${s.depDate} à ${s.depTime} — Arrivée : ${s.arrDate} à ${s.arrTime}
    </p>
  `).join("");
}

// Génère un PDF simple récapitulant la réservation (PNR, vol, passager, montant, mode de
// paiement choisi). Pas de billet émis à ce stade — ce PDF confirme uniquement la demande.
async function buildReservationPDF({ orderId, passenger, totalAmount, currency, segments, paymentMethod }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.043, 0.122, 0.227);
  const gray = rgb(0.35, 0.35, 0.35);

  let y = 800;
  const left = 50;

  function line(text, { size = 11, useFont = font, color = navy, gap = 18 } = {}) {
    page.drawText(text, { x: left, y, size, font: useFont, color });
    y -= gap;
  }

  line("ALAMIN TOURISM & TRAVEL", { size: 18, useFont: bold, gap: 22 });
  line("Salines Ouest, Mohamed Kamil Road, Djibouti", { size: 10, color: gray, gap: 30 });

  line("Confirmation de demande de réservation", { size: 15, useFont: bold, gap: 26 });

  line(`Référence de réservation (PNR) : ${orderId || "en attente"}`, { useFont: bold, gap: 20 });
  line(`Passager : ${passenger.givenName || ""} ${passenger.surname || ""}`.trim(), { gap: 18 });
  line(`Document de voyage : ${passenger.idNumber || "-"} (${passenger.issuingCountry || "-"})`, { gap: 18 });
  line(`Téléphone : ${passenger.phone || "-"}`, { gap: 18 });
  line(`Email : ${passenger.email || "-"}`, { gap: 24 });

  line("Détails du vol", { size: 13, useFont: bold, gap: 20 });
  if (segments.length) {
    segments.forEach((s) => {
      line(`ET${s.flightNumber || ""}  ${s.depAirport} -> ${s.arrAirport}`, { gap: 16 });
      line(`Départ : ${s.depDate} ${s.depTime}   Arrivée : ${s.arrDate} ${s.arrTime}`, { size: 10, color: gray, gap: 22 });
    });
  } else {
    line("Détails à confirmer avec l'agence.", { size: 10, color: gray, gap: 22 });
  }

  line(`Montant total : ${totalAmount} ${currency}`, { useFont: bold, gap: 20 });
  line(`Mode de paiement choisi : ${PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod}`, { size: 10, gap: 24 });

  line("IMPORTANT : ceci est une confirmation de demande de réservation.", { size: 10, useFont: bold, color: rgb(0.69, 0, 0.13), gap: 14 });
  line("Le billet n'est pas encore émis. Il sera émis par l'agence une fois le paiement confirmé.", { size: 10, color: rgb(0.69, 0, 0.13), gap: 26 });

  line("Contact : WhatsApp +253 77 646 406", { size: 10, color: gray });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

async function sendConfirmationEmails({ orderId, passenger, totalAmount, currency, segments, paymentMethod, priced }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email non envoyé : GMAIL_USER / GMAIL_APP_PASSWORD non configurés sur Vercel.");
    return;
  }

  const flightHtml = buildFlightLinesHtml(segments);
  const fullName = `${passenger.givenName || ""} ${passenger.surname || ""}`.trim();
  const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

  let pdfBuffer = null;
  try {
    pdfBuffer = await buildReservationPDF({ orderId, passenger, totalAmount, currency, segments, paymentMethod });
  } catch (pdfErr) {
    console.error("Erreur génération PDF réservation:", pdfErr.message);
  }
  const attachments = pdfBuffer
    ? [{ filename: `reservation-${orderId || "alamintravel"}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
    : [];

  // Email au client
  const clientHtml = `
    <div style="font-family: Arial, sans-serif; color:#0B1F3A;">
      <h2 style="color:#1565C0;">Confirmation de votre demande de réservation</h2>
      <p>Bonjour ${fullName || "Cher client"},</p>
      <p>Votre demande de réservation Ethiopian Airlines a bien été enregistrée. Vous trouverez le récapitulatif en pièce jointe (PDF).</p>
      <p><strong>Référence de réservation (PNR) : ${orderId || "en attente"}</strong></p>
      <p style="color:#B00020;">Le billet n'est pas encore émis — il le sera dès que votre paiement sera confirmé par notre équipe.</p>
      <p><strong>Mode de paiement choisi :</strong> ${paymentLabel}</p>
      ${flightHtml}
      <p><strong>Montant total : ${totalAmount} ${currency}</strong></p>
      <p>Notre équipe vous contactera rapidement pour finaliser le paiement. Pour toute question, contactez-nous sur WhatsApp au +253 77 646 406.</p>
      <p style="margin-top:24px;">Alamin Tourism & Travel<br/>Salines Ouest, Mohamed Kamil Road, Djibouti</p>
    </div>
  `;

  // Email interne à l'agence (suivi + encaissement)
  const agencyHtml = `
    <div style="font-family: Arial, sans-serif; color:#0B1F3A;">
      <h2 style="color:#D4881A;">Nouvelle demande de réservation Ethiopian Airlines</h2>
      <p><strong>PNR : ${orderId || "en attente"}</strong></p>
      <p><strong>Mode de paiement choisi par le client :</strong> ${paymentLabel}</p>
      <p><strong>Passager :</strong> ${fullName || "-"}<br/>
         <strong>Téléphone :</strong> ${passenger.phone || "-"}<br/>
         <strong>Email :</strong> ${passenger.email || "-"}<br/>
         <strong>Passeport :</strong> ${passenger.idNumber || "-"} (${passenger.issuingCountry || "-"}, expire le ${passenger.expiryDate || "-"})</p>
      ${flightHtml}
      <p><strong>Montant total : ${totalAmount} ${currency}</strong></p>
      <p style="color:#B00020;">⚠️ Action requise : contacter le client pour encaisser le paiement (${paymentLabel}), puis émettre le billet via l'outil d'émission une fois le paiement confirmé.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Alamin Travels" <${process.env.GMAIL_USER}>`,
      to: passenger.email,
      subject: `Confirmation de votre demande de réservation - PNR ${orderId || ""}`,
      html: clientHtml,
      attachments,
    });
  } catch (e) {
    console.error("Erreur envoi email client:", e.message);
  }

  try {
    await transporter.sendMail({
      from: `"Alamin Travels - Notifications" <${process.env.GMAIL_USER}>`,
      to: AGENCY_NOTIFY_EMAIL,
      subject: `Nouvelle réservation Ethiopian Airlines - PNR ${orderId || ""}`,
      html: agencyHtml,
      attachments,
    });
  } catch (e) {
    console.error("Erreur envoi email agence:", e.message);
  }
}

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

function buildOfferPriceXML({ responseId, offerId, offerItemId }) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OfferPriceRQ xmlns="http://www.iata.org/IATA/EDIST/2017.2" Version="2017.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
        <Offer OfferID="${offerId}" Owner="ET" ResponseID="${responseId}">
            <OfferItem OfferItemID="${offerItemId}">
                <PassengerRefs>PAX001</PassengerRefs>
            </OfferItem>
        </Offer>
    </Query>
    <DataLists>
        <PassengerList>
            <Passenger PassengerID="PAX001">
                <PTC>ADT</PTC>
            </Passenger>
        </PassengerList>
    </DataLists>
</OfferPriceRQ>`;
}

async function priceOffer(token, { responseId, offerId, offerItemId }) {
  const url = `${BASE_URL}/${RELATIVE}/OfferPrice`;
  const xml = buildOfferPriceXML({ responseId, offerId, offerItemId });

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
  const rs = parsed.OfferPriceRS;
  const newResponseId = rs.ShoppingResponseID?.ResponseID;

  let offer = rs.PricedOffer || rs.OffersGroup?.AirlineOffers?.Offer;
  if (Array.isArray(offer)) offer = offer[0];
  const newOfferId = offer.$.OfferID;

  let offerItem = offer.OfferItem;
  if (Array.isArray(offerItem)) offerItem = offerItem[0];
  const newOfferItemId = offerItem.$.OfferItemID;

  const total = offerItem.TotalPriceDetail?.TotalAmount?.SimpleCurrencyPrice;
  const totalAmount = typeof total === "object" ? total._ : total;
  const currency = (typeof total === "object" ? total.$?.Code : null) || "ETB";

  return { responseId: newResponseId, offerId: newOfferId, offerItemId: newOfferItemId, totalAmount, currency };
}

function buildOrderCreateXML({ responseId, offerId, offerItemId, totalAmount, currency, passenger }) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OrderCreateRQ xmlns="http://www.iata.org/IATA/EDIST/2017.2" Version="2017.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
        <Order>
            <Offer OfferID="${offerId}" Owner="ET" ResponseID="${responseId}">
                <OfferItem OfferItemID="${offerItemId}">
                    <PassengerRefs>PAX001</PassengerRefs>
                </OfferItem>
            </Offer>
        </Order>
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
            </Payment>
        </Payments>
        <!-- FIX: DataLists doit être imbriqué DANS Query pour OrderCreateRQ,
             contrairement à OfferPriceRQ où DataLists est au même niveau que Query
             (confirmé par la documentation officielle Ethiopian NDC API Guide). -->
        <DataLists>
            <PassengerList>
                <Passenger PassengerID="PAX001">
                    <PTC>${passenger.ptc}</PTC>
                    <Individual>
                        <Birthdate>${passenger.birthdate}</Birthdate>
                        <Gender>${passenger.gender}</Gender>
                        <NameTitle>${passenger.title}</NameTitle>
                        <GivenName>${passenger.givenName}</GivenName>
                        <Surname>${passenger.surname}</Surname>
                    </Individual>
                    <IdentityDocument>
                        <IdentityDocumentNumber>${passenger.idNumber}</IdentityDocumentNumber>
                        <IdentityDocumentType>${passenger.idType}</IdentityDocumentType>
                        <IssuingCountryCode>${passenger.issuingCountry}</IssuingCountryCode>
                        <CitizenshipCountryCode>${passenger.citizenshipCountry}</CitizenshipCountryCode>
                        <IssueDate>${passenger.issueDate}</IssueDate>
                        <ExpiryDate>${passenger.expiryDate}</ExpiryDate>
                        <Birthdate>${passenger.birthdate}</Birthdate>
                        <Birthplace>${passenger.issuingCountry}</Birthplace>
                    </IdentityDocument>
                    <ContactInfoRef>CTC01</ContactInfoRef>
                </Passenger>
            </PassengerList>
            <!-- FIX: le vrai nom est ContactList (pas ContactInfoList), attribut ContactID
                 (pas ContactInfoID), un <ContactProvided> séparé par email/téléphone,
                 EmailAddressValue (pas EmailAddressText), ContactType au lieu de
                 ContactTypeText, et un <Individual> requis car ce contact est aussi le Payer. -->
            <ContactList>
                <ContactInformation ContactID="CTC01">
                    <ContactType>PAYMENT</ContactType>
                    <ContactProvided>
                        <EmailAddress>
                            <Label>HOME</Label>
                            <EmailAddressValue>${passenger.email}</EmailAddressValue>
                        </EmailAddress>
                    </ContactProvided>
                    <ContactProvided>
                        <Phone>
                            <Label>MOBILE</Label>
                            <CountryDialingCode>${passenger.phoneCountryCode || "253"}</CountryDialingCode>
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
</OrderCreateRQ>`;
}

// NOTE : l'émission du billet (AirDocIssue) ne se fait plus dans ce fichier — voir
// /api/issue-ticket-ethiopian.js, déclenché manuellement par l'agence une fois le
// paiement du client confirmé (sécurité financière : plus d'émission automatique).

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée, utiliser POST" });

  const { responseId, offerId, offerItemId, totalAmount, currency, passenger } = req.body || {};
  // FIX (sécurité financière) : le paiement choisi par le client ne déclenche plus jamais
  // l'émission automatique du billet (AirDocIssue). Cette réservation crée uniquement le PNR.
  // Le billet n'est émis que via l'endpoit séparé et protégé /api/issue-ticket-ethiopian,
  // déclenché manuellement par l'agence une fois le paiement réellement confirmé.
  const paymentMethod = ["agency_cash", "credit_card", "mobile_money"].includes(req.body?.paymentMethod)
    ? req.body.paymentMethod
    : "agency_cash";

  if (!responseId || !offerId || !offerItemId || !totalAmount || !passenger) {
    return res.status(400).json({ error: "Champs requis manquants: responseId, offerId, offerItemId, totalAmount, passenger" });
  }

  if (!passenger.phone) {
    return res.status(400).json({ error: "Champ requis manquant dans passenger: phone" });
  }
  if (!passenger.email) {
    passenger.email = FALLBACK_AGENCY_EMAIL;
  }

  try {
    const token = await getAccessToken();

    let priced;
    try {
      priced = await priceOffer(token, { responseId, offerId, offerItemId });
      console.log("Ethiopian NDC OfferPrice OK:", JSON.stringify(priced));
    } catch (priceErr) {
      console.error("Ethiopian NDC OFFERPRICE error:", priceErr.response?.data || priceErr.message);
      return res.status(502).json({
        error: "Erreur à l'étape OfferPrice (avant réservation)",
        step: "OfferPrice",
        details: priceErr.response?.data || priceErr.message,
      });
    }

    const xml = buildOrderCreateXML({ ...priced, passenger });

    let response;
    try {
      const orderUrl = `${BASE_URL}/${RELATIVE}/OrderCreate`;
      response = await axios.post(orderUrl, xml, {
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/xml",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (orderErr) {
      console.error("Ethiopian NDC ORDERCREATE error:", orderErr.response?.data || orderErr.message);
      console.error("Ethiopian NDC ORDERCREATE request sent:", xml);
      return res.status(502).json({
        error: "Erreur à l'étape OrderCreate (réservation)",
        step: "OrderCreate",
        details: orderErr.response?.data || orderErr.message,
      });
    }

    const parsed = await xml2js.parseStringPromise(response.data, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });
    // FIX: OrderID est un attribut XML (<Order OrderID="SNOSQH">), pas une balise-fille.
    // Avec xml2js, les attributs sont dans la clé "$", pas directement sur l'objet Order.
    const orderId = parsed.OrderViewRS?.Response?.Order?.$?.OrderID || null;

    // Envoi des emails de confirmation (client + agence), avec le PDF de réservation en pièce
    // jointe — ne bloque jamais la réponse de succès si l'email échoue, le PNR est déjà créé.
    try {
      const segments = extractFlightSummary(parsed);
      await sendConfirmationEmails({ orderId, passenger, totalAmount, currency, segments, paymentMethod, priced });
    } catch (emailErr) {
      console.error("Erreur lors de l'envoi des emails de confirmation:", emailErr.message);
    }

    return res.status(200).json({
      orderId,
      status: "reservation_created_pending_payment",
      paymentMethod,
      raw: response.data,
    });
  } catch (err) {
    console.error("Ethiopian NDC reserve error (general):", err.response?.data || err.message);
    return res.status(502).json({ error: "Erreur lors de la réservation Ethiopian Airlines", details: err.response?.data || err.message });
  }
};
