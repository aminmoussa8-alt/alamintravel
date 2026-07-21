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
 *
 * ------------------------------------------------------------------------
 * CORRECTIFS (voir commentaires marqués "FIX:") :
 * 1. Le XML OrderCreate référençait un contact (CTC01) sans jamais le
 *    définir dans <DataLists>, ce qui provoque une erreur de validation
 *    côté Ethiopian (référence orpheline). Ajout du bloc <ContactInfoList>.
 * 2. Le formulaire du site affiche "Email (optionnel)" — la validation
 *    n'exige donc plus l'email du client. Si absent, l'email de l'agence
 *    (reservations@alamintravel-dj.com) est utilisé en secours, car
 *    Ethiopian NDC exige un contact valide dans tous les cas.
 * ------------------------------------------------------------------------
 */

const axios = require("axios");
const xml2js = require("xml2js");

const BASE_URL = process.env.ET_NDC_BASE_URL;
const RELATIVE = process.env.ET_NDC_RELATIVE;
const CLIENT = process.env.ET_NDC_CLIENT;
const SECRET = process.env.ET_NDC_SECRET;
const SCOPE = process.env.ET_NDC_SCOPE;
const AGENCY_NAME = process.env.ET_NDC_AGENCY_NAME || "Alamin Travels";
const IATA_NUMBER = process.env.ET_NDC_IATA_NUMBER;
const AGENCY_ID = process.env.ET_NDC_AGENCY_ID;

// FIX: email de secours utilisé quand le client ne fournit pas le sien
const FALLBACK_AGENCY_EMAIL = "reservations@alamintravel-dj.com";

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
    </Query>
    <DataLists>
        <!-- FIX: bloc ajouté pour définir le contact référencé par CTC01
             (Payer.ContactInfoRefs et Passenger.ContactInfoRef) -->
        <ContactInfoList>
            <ContactInformation ContactInfoID="CTC01">
                <ContactTypeText>Personal</ContactTypeText>
                <EmailAddress>
                    <EmailAddressText>${passenger.email}</EmailAddressText>
                </EmailAddress>
                <Phone>
                    <CountryDialingCode>${passenger.phoneCountryCode || "253"}</CountryDialingCode>
                    <PhoneNumber>${passenger.phone}</PhoneNumber>
                </Phone>
            </ContactInformation>
        </ContactInfoList>
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
                </IdentityDocument>
                <ContactInfoRef>CTC01</ContactInfoRef>
            </Passenger>
        </PassengerList>
    </DataLists>
</OrderCreateRQ>`;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée, utiliser POST" });

  const { responseId, offerId, offerItemId, totalAmount, currency, passenger } = req.body || {};

  if (!responseId || !offerId || !offerItemId || !totalAmount || !passenger) {
    return res.status(400).json({ error: "Champs requis manquants: responseId, offerId, offerItemId, totalAmount, passenger" });
  }

  // FIX: le téléphone reste requis (le formulaire du site le demande déjà).
  if (!passenger.phone) {
    return res.status(400).json({ error: "Champ requis manquant dans passenger: phone" });
  }
  // FIX: email optionnel côté client — repli sur l'email de l'agence si absent,
  // car Ethiopian NDC exige un contact valide même si le client n'en fournit pas.
  if (!passenger.email) {
    passenger.email = FALLBACK_AGENCY_EMAIL;
  }

  try {
    const token = await getAccessToken();

    // Étape obligatoire : OfferPrice, avant OrderCreate (sinon "Invalid Request")
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
    const orderIdRaw = parsed.OrderViewRS?.Response?.Order?.OrderID;
    const orderId = typeof orderIdRaw === "object" ? orderIdRaw._ : orderIdRaw;

    return res.status(200).json({ orderId, raw: response.data });
  } catch (err) {
    console.error("Ethiopian NDC reserve error (general):", err.response?.data || err.message);
    return res.status(502).json({ error: "Erreur lors de la réservation Ethiopian Airlines", details: err.response?.data || err.message });
  }
};
