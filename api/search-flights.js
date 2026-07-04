// /api/search-flights.js
// Recherche de vols via Duffel. Le token Duffel reste ici, côté serveur — JAMAIS envoyé au navigateur.
// Configurer dans Vercel > Settings > Environment Variables : DUFFEL_API_KEY

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { origin, destination, departureDate, returnDate, passengers, cabinClass } = req.body || {};

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: 'origin, destination et departureDate sont requis' });
  }

  const slices = [{ origin, destination, departure_date: departureDate }];
  if (returnDate) {
    slices.push({ origin: destination, destination: origin, departure_date: returnDate });
  }

  const passengerCount = Number(passengers) > 0 ? Number(passengers) : 1;

  const body = {
    data: {
      slices,
      passengers: Array.from({ length: passengerCount }, () => ({ type: 'adult' })),
      cabin_class: cabinClass || 'economy',
    },
  };

  try {
    const response = await fetch('https://api.duffel.com/air/offer_requests?return_offers=true', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        'Duffel-Version': 'v2',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur Duffel:', data);
      return res.status(response.status).json({ error: data.errors?.[0]?.message || 'Erreur Duffel' });
    }

    const offers = (data.data.offers || []).slice(0, 20).map((o) => ({
      id: o.id,
      total_amount: o.total_amount,
      total_currency: o.total_currency,
      owner: o.owner?.name,
      expires_at: o.expires_at,
      slices: o.slices.map((s) => ({
        origin: s.origin.iata_code,
        destination: s.destination.iata_code,
        duration: s.duration,
        segments: s.segments.map((seg) => ({
          airline: seg.marketing_carrier?.name,
          flight_number: seg.marketing_carrier_flight_number,
          origin: seg.origin.iata_code,
          destination: seg.destination.iata_code,
          departing_at: seg.departing_at,
          arriving_at: seg.arriving_at,
        })),
      })),
    }));

    return res.status(200).json({ offers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
