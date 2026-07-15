/**
 * /api/search-flights-ethiopian.js
 * ------------------------------------------------------------------------
 * Fonction serverless Vercel — Recherche de vols via l'API NDC directe
 * d'Ethiopian Airlines (remplace Duffel pour cette compagnie).
 *
 * Variables d'environnement à configurer sur Vercel (Settings > Environment
 * Variables), au lieu de les laisser en clair dans le code :
 *
 *   ET_NDC_BASE_URL       = https://aks-cluster-test.ethiopianairlines.com
 *   ET_NDC_RELATIVE       = agencyportal-ethiopianndcapi
 *   ET_NDC_CLIENT         = ndcagency
 *   ET_NDC_SECRET         = 0S64z6Es5F+4HeDrBjCScQ==
 *   ET_NDC_SCOPE          = ndc@ethiopianairlines
 *   ET_NDC_AGENCY_NAME    = Alamin Travels
 *   ET_NDC_IATA_NUMBER    = 76200062
 *   ET_NDC_AGENCY_ID      = N131760
 *   ET_NDC_PSEUDO_IATA    = 76000396   (secours si IATA_NUMBER échoue)
 *
 * Appel depuis le frontend :
 *   GET /api/search-flights-ethiopian?origin=ADD&destination=NBO&date=2026-09-15&adults=1
 *
 * Réponse JSON :
 *   { offers: [ { offerId, offerItemId, responseId, totalAmount, baseAmount, taxAmount, currency } ] }
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

async function getAccessToken() {
  const url = `${BASE_URL}/${RELATIVE}/Auth`;
  const body = { Client: CLIENT, Secret: SECRET, Scope: SCOPE, grant_type: "client_credentials" };
  const res = await axios.post(url, body, { headers: { "Content-Type": "application/json" } });
  return res.data.access_token || res.data.token || res.data.accessToken;
}

function buildAirShoppingXML({ origin, destination, date, adults }) {
  const passengers = Array.from({ length: adults }, (_, i) => `
            <Passenger PassengerID="PAX00${i + 1}">
                <PTC>ADT</PTC>
            </Passenger>`).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AirShoppingRQ xmlns="http://www.iata.org/IATA/EDIST/2017.2" Version="2017.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Document>
        <Name>ETHIOPIAN AIRLINES NDC</Name>
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
    <CoreQuery>
        <OriginDestinations>
            <OriginDestination>
                <Departure>
                    <AirportCode>${origin}</AirportCode>
                    <Date>${date}</Date>
                </Departure>
                <Arrival>
                    <AirportCode>${destination}</AirportCode>
                </Arrival>
            </OriginDestination>
        </OriginDestinations>
    </CoreQuery>
    <DataLists>
        <PassengerList>${passengers}
        </PassengerList>
    </DataLists>
</AirShoppingRQ>`;
}

async function parseOffers(xml) {
  const parsed = await xml2js.parseStringPromise(xml, {
    explicitArray: false,
    tagNameProcessors: [xml2js.processors.stripPrefix],
  });
  const rs = parsed.AirShoppingRS;
  const responseId = rs.ShoppingResponseID?.ResponseID;

  let airlineOffers = rs.OffersGroup?.AirlineOffers?.Offer;
  if (!airlineOffers) return [];
  if (!Array.isArray(airlineOffers)) airlineOffers = [airlineOffers];

  const offers = [];
  airlineOffers.forEach((offer) => {
    let items = offer.OfferItem;
    if (!items) return;
    if (!Array.isArray(items)) items = [items];

    items.forEach((item) => {
      const total = item.TotalPriceDetail?.TotalAmount?.SimpleCurrencyPrice;
      const base = item.TotalPriceDetail?.BaseAmount;
      const taxes = item.TotalPriceDetail?.Taxes?.Total;

      offers.push({
        responseId,
        offerId: offer.$.OfferID,
        offerItemId: item.$.OfferItemID,
        totalAmount: typeof total === "object" ? total._ : total,
        baseAmount: typeof base === "object" ? base._ : base,
        taxAmount: typeof taxes === "object" ? taxes._ : taxes,
        currency: (typeof total === "object" ? total.$?.Code : null) || "ETB",
      });
    });
  });

  return offers;
}

module.exports = async (req, res) => {
  // CORS - même comportement que les autres fonctions Duffel du site
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { origin, destination, date, adults } = req.method === "GET" ? req.query : req.body;

  if (!origin || !destination || !date) {
    return res.status(400).json({ error: "Paramètres requis: origin, destination, date" });
  }

  try {
    const token = await getAccessToken();
    const xml = buildAirShoppingXML({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      date,
      adults: parseInt(adults, 10) || 1,
    });

    const shoppingUrl = `${BASE_URL}/${RELATIVE}/AirShopping`;
    const response = await axios.post(shoppingUrl, xml, {
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/xml",
        Authorization: `Bearer ${token}`,
      },
    });

    const offers = await parseOffers(response.data);
    return res.status(200).json({ offers, source: "ethiopian-ndc" });
  } catch (err) {
    console.error("Ethiopian NDC search error:", err.response?.data || err.message);
    return res.status(502).json({ error: "Erreur lors de la recherche de vols Ethiopian Airlines", details: err.response?.data || err.message });
  }
};
