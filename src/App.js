import { useState, useEffect, useRef } from "react";

// ── PALETTE ────────────────────────────────────────────────────────────────────
const T = {
  navy:    "#0B1F3A",
  navyD:   "#060F1E",
  blue:    "#1565C0",
  blueL:   "#1E88E5",
  sky:     "#4FC3F7",
  gold:    "#F5A623",
  goldD:   "#D4881A",
  white:   "#FFFFFF",
  gray50:  "#F8FAFC",
  gray100: "#F1F5F9",
  gray300: "#CBD5E1",
  gray500: "#64748B",
  gray700: "#334155",
};

// ── DESTINATIONS DJIBOUTI ──────────────────────────────────────────────────────
const DESTINATIONS = [
  { name:"Lac Assal", tag:"Incontournable", desc:"Le point le plus bas d'Afrique • 155m sous le niveau de la mer", img:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=90", color:"#0B4D68" },
  { name:"Lac Abbé", tag:"Aventure", desc:"Cheminées de calcaire • Paysage lunaire unique au monde", img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=90", color:"#5C3A1E" },
  { name:"Requins baleines", tag:"Plongée", desc:"Golfe de Tadjoura • Novembre à Février", img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=90", color:"#0D4A7A" },
  { name:"Ville de Djibouti", tag:"Culture", desc:"Capitale cosmopolite • Carrefour de l'Afrique et de l'Orient", img:"https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&q=90", color:"#1A237E" },
  { name:"Golfe de Tadjoura", tag:"Nature", desc:"Eaux turquoise • Faune marine exceptionnelle", img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=90", color:"#01579B" },
];

// ── SERVICES ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon:"✈️", title:"Billets d'Avion", desc:"Vols internationaux depuis Djibouti via Amadeus. Meilleurs tarifs garantis.", color:"#1565C0" },
  { icon:"🏨", title:"Hôtels & Séjours", desc:"Sélection d'hôtels à Djibouti et dans le monde entier.", color:"#0D47A1" },
  { icon:"🕌", title:"Omra", desc:"Packages complets Omra. Accompagnement spirituel.", color:"#4527A0" },
  { icon:"🚗", title:"Location de Voitures", desc:"Véhicules disponibles à Djibouti. Chauffeurs expérimentés.", color:"#006064" },
  { icon:"📋", title:"Visa & Documents", desc:"Assistance visa pour toutes destinations. Traitement rapide.", color:"#1B5E20" },
  { icon:"🌍", title:"Voyages Organisés", desc:"Circuits à Djibouti et en Afrique de l'Est. Groupes et individuels.", color:"#E65100" },
];

// ── TÉMOIGNAGES ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name:"Ahmed Hassan", role:"Homme d'affaires, Djibouti", text:"Alamin Travel a géré tous mes déplacements professionnels pendant 3 ans. Service impeccable, toujours disponibles à toute heure.", stars:5 },
  { name:"Fatouma Ali", role:"Famille, Djibouti", text:"Nos vacances en famille étaient parfaites. Tout était organisé : billets, hôtel, transferts. Je recommande sans hésiter !", stars:5 },
  { name:"Mohamed Idriss", role:"Pèlerin, Omra 2024", text:"Le package Omra était exceptionnel. Hébergement à deux pas de la Mosquée, accompagnement spirituel de qualité.", stars:5 },
  { name:"Khadija Omar", role:"Étudiante, Paris", text:"Ils m'ont aidé avec mon visa étudiant et mon billet. Réactifs, professionnels. Merci infiniment à toute l'équipe !", stars:5 },
];

// ── STATS ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value:"15+", label:"Années d'expérience", icon:"🏆" },
  { value:"500+", label:"Clients satisfaits", icon:"👥" },
  { value:"50+", label:"Destinations", icon:"🌍" },
  { value:"24/7", label:"Support disponible", icon:"📞" },
];

// ── COMPAGNIES AÉRIENNES ──────────────────────────────────────────────────────
const AIRLINES = [
  { name:"Qatar Airways", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Qatar_Airways_logo.svg" },
  { name:"Ethiopian Airlines", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Ethiopian_Airlines_Logo.svg" },
  { name:"Emirates", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Emirates_logo.svg" },
  { name:"flydubai", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Fly_Dubai_logo_2010_05.svg" },
  { name:"flynas", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Flynas_Logo.svg" },
];

// ── COMPOSANT LOGO ────────────────────────────────────────────────────────────
// Logo officiel Alamin Tourism & Travel — image fournie, affichée telle quelle
// (aucune retouche de couleur/forme), centrée, responsive, proportions conservées.
// Fichier attendu : /public/alamin-logo.png
const Logo = ({ size = 52 }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
    <img
      src="/alamin-logo.png"
      alt="Alamin Tourism & Travel — Agent IATA Accrédité"
      style={{
        width: size * 4.2,
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  </div>
);

// ── STYLES GLOBAUX ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DM Sans', sans-serif; background:#fff; color:${T.navy}; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:#f1f5f9; }
  ::-webkit-scrollbar-thumb { background:${T.blue}; border-radius:3px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes scrollX { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  .fade-up { animation: fadeUp 0.7s ease both; }
  .fade-in { animation: fadeIn 0.5s ease both; }
  .al-track { display:flex; animation:scrollX 25s linear infinite; width:max-content; }
  .al-track:hover { animation-play-state:paused; }
  .dest-card:hover .dest-img { transform:scale(1.08); }
  .dest-card:hover .dest-overlay { opacity:1; }
  .service-card:hover { transform:translateY(-6px); box-shadow:0 20px 60px rgba(21,101,192,0.15) !important; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(21,101,192,0.4) !important; }
  .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(245,166,35,0.5) !important; }
  .nav-link:hover { color:${T.sky} !important; }
  .testimonial-card:hover { transform:translateY(-4px); }

  /* ── RESPONSIVE / MOBILE ─────────────────────────────────────────────── */
  .mobile-menu-btn { display:none; }

  @media (max-width: 900px) {
    .desktop-nav-links { display:none !important; }
    .desktop-nav-actions { display:none !important; }
    .mobile-menu-btn { display:flex !important; }
    nav > div { padding: 0 20px !important; }
  }

  @media (max-width: 768px) {
    section { padding-left:20px !important; padding-right:20px !important; }
    .hero-section { padding-left:0 !important; padding-right:0 !important; }
    .hero-content { padding-left:20px !important; padding-right:20px !important; padding-top:110px !important; }
    .hero-flex { flex-direction:column !important; align-items:flex-start !important; }
    .hero-title { font-size:38px !important; }
    .hero-contact-card { margin-left:0 !important; margin-top:28px !important; width:100%; }
    .hero-stats { gap:24px !important; }
    .section-title { font-size:30px !important; }
    .services-grid, .packages-grid, .testimonials-grid { grid-template-columns:1fr !important; }
    .dest-grid { grid-template-columns:1fr !important; grid-template-rows:auto !important; }
    .dest-grid > div { grid-row:auto !important; height:220px !important; }
    .dest-header { flex-direction:column !important; align-items:flex-start !important; gap:16px; }
    .dest-header p { text-align:left !important; max-width:100% !important; }
    .agence-photos-grid { grid-template-columns:1fr 1fr !important; }
    .agence-photos-grid > div:first-child { grid-column:span 2 !important; }
    .agence-info-grid { grid-template-columns:1fr !important; }
    .footer-grid { grid-template-columns:1fr 1fr !important; gap:28px !important; }
    .cta-title { font-size:32px !important; }
  }

  @media (max-width: 480px) {
    .footer-grid { grid-template-columns:1fr !important; }
    .hero-title { font-size:30px !important; }
    .section-title { font-size:26px !important; }
    .flight-search-form { flex-direction:column !important; }
    .flight-search-form input, .flight-search-form select, .flight-search-form button {
      width:100% !important; min-width:0 !important;
    }
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// RECHERCHE & RÉSERVATION DE VOLS (Duffel)
// ══════════════════════════════════════════════════════════════════════════════
const inputStyle = {
  flex: 1, minWidth: 130, padding: "13px 16px", border: `1px solid ${T.gray300}`,
  borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: T.navy, background: "white",
};

function FlightSearchWidget() {
  const [form, setForm] = useState({ origin: "", destination: "", departureDate: "", returnDate: "", passengers: "1" });
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", notes: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: id === "origin" || id === "destination" ? value.toUpperCase() : value }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOffers(null);
    try {
      const resp = await fetch("/api/search-flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: form.origin,
          destination: form.destination,
          departureDate: form.departureDate,
          returnDate: form.returnDate || undefined,
          passengers: form.passengers,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) setError(data.error || "Erreur inconnue");
      else setOffers(data.offers || []);
    } catch (err) {
      setError("Erreur réseau, réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function openReserveModal(offer) {
    setSelectedOffer(offer);
    setSent(false);
    setCustomer({ name: "", phone: "", email: "", notes: "" });
  }

  async function handleReserve() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert("Merci de remplir au moins le nom et le téléphone.");
      return;
    }
    setSending(true);
    try {
      const resp = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer: selectedOffer,
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          notes: customer.notes,
        }),
      });
      const data = await resp.json();
      if (data.success) setSent(true);
      else alert("Erreur lors de l'envoi de la demande, réessayez.");
    } catch (err) {
      alert("Erreur réseau, réessayez.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="recherche" style={{ padding: "96px 40px", background: T.gray50 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: `${T.blue}15`, color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: 3, padding: "6px 16px", borderRadius: 30, marginBottom: 16 }}>RECHERCHE EN DIRECT</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 700, color: T.navy }}>
            Trouvez votre <span style={{ color: T.blue }}>vol</span>
          </h2>
        </div>

        <form onSubmit={handleSearch} className="flight-search-form" style={{
          display: "flex", flexWrap: "wrap", gap: 12, background: "white", padding: 20,
          borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.1)", marginBottom: 32,
        }}>
          <input id="origin" placeholder="Origine (ex: JIB)" maxLength={3} required
            value={form.origin} onChange={handleChange} style={{ ...inputStyle, textTransform: "uppercase" }} />
          <input id="destination" placeholder="Destination (ex: CDG)" maxLength={3} required
            value={form.destination} onChange={handleChange} style={{ ...inputStyle, textTransform: "uppercase" }} />
          <input id="departureDate" type="date" required
            value={form.departureDate} onChange={handleChange} style={inputStyle} />
          <input id="returnDate" type="date"
            value={form.returnDate} onChange={handleChange} style={inputStyle} />
          <select id="passengers" value={form.passengers} onChange={handleChange} style={inputStyle}>
            <option value="1">1 passager</option>
            <option value="2">2 passagers</option>
            <option value="3">3 passagers</option>
            <option value="4">4 passagers</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading} style={{
            padding: "13px 32px", background: `linear-gradient(135deg,${T.blue},${T.blueL})`,
            color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
          }}>{loading ? "Recherche…" : "✈️ Rechercher"}</button>
        </form>

        {error && <p style={{ color: "#B00020", textAlign: "center" }}>Erreur : {error}</p>}
        {offers && offers.length === 0 && <p style={{ textAlign: "center", color: T.gray500 }}>Aucun vol trouvé pour ces critères.</p>}

        {offers && offers.map((offer) => {
          const slice = offer.slices[0];
          const seg0 = slice.segments[0];
          const segLast = slice.segments[slice.segments.length - 1];
          return (
            <div key={offer.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
              background: "white", borderRadius: 16, padding: 20, marginBottom: 14,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: `1px solid ${T.gray100}`,
            }}>
              <div>
                <div style={{ fontWeight: 700, color: T.navy, fontSize: 15 }}>{offer.owner} — {slice.origin} → {slice.destination}</div>
                <div style={{ fontSize: 12, color: T.gray500, marginTop: 4 }}>
                  Départ {new Date(seg0.departing_at).toLocaleString("fr-FR")} — Arrivée {new Date(segLast.arriving_at).toLocaleString("fr-FR")}
                  {slice.segments.length > 1 ? ` (${slice.segments.length - 1} escale(s))` : " (direct)"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: T.blue, fontSize: 18, fontFamily: "'Playfair Display', serif" }}>{offer.total_amount} {offer.total_currency}</div>
                <button onClick={() => openReserveModal(offer)} className="btn-gold" style={{
                  marginTop: 8, padding: "9px 20px", background: `linear-gradient(135deg,${T.gold},${T.goldD})`,
                  color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>Réserver →</button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOffer && (
        <div style={{ display: "flex", position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "white", padding: 32, borderRadius: 20, maxWidth: 420, width: "100%" }}>
            {sent ? (
              <>
                <p style={{ color: T.navy, fontWeight: 700, fontSize: 16, lineHeight: 1.6 }}>
                  ✅ Votre demande a bien été envoyée ! Notre équipe vous contacte rapidement pour confirmer.
                </p>
                <button onClick={() => setSelectedOffer(null)} style={{
                  marginTop: 16, padding: "10px 20px", background: T.navy, color: "white",
                  border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600,
                }}>Fermer</button>
              </>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.navy, marginBottom: 4 }}>Demande de réservation</h3>
                <div style={{ fontSize: 13, color: T.gray500, marginBottom: 20 }}>
                  {selectedOffer.owner} — {selectedOffer.slices[0].origin} → {selectedOffer.slices[0].destination} — {selectedOffer.total_amount} {selectedOffer.total_currency}
                </div>
                <input placeholder="Nom complet" required value={customer.name}
                  onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
                <input type="tel" placeholder="Téléphone (WhatsApp)" required value={customer.phone}
                  onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
                <input type="email" placeholder="Email (optionnel)" value={customer.email}
                  onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
                <textarea placeholder="Remarques (optionnel)" rows={2} value={customer.notes}
                  onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", marginBottom: 16, boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleReserve} disabled={sending} style={{
                    flex: 1, padding: 12, background: `linear-gradient(135deg,${T.blue},${T.blueL})`,
                    color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600,
                  }}>{sending ? "Envoi…" : "Envoyer la demande"}</button>
                  <button onClick={() => setSelectedOffer(null)} style={{
                    padding: "12px 18px", background: T.gray100, border: "none", borderRadius: 10, cursor: "pointer", color: T.navy,
                  }}>Annuler</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPALE
// ══════════════════════════════════════════════════════════════════════════════
export default function AlaminLanding() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background: scrolled ? "rgba(11,31,58,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition:"all 0.4s ease",
        padding:"0 40px",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", height:72, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Logo size={44} light />
          <div className="desktop-nav-links" style={{ display:"flex", gap:32, alignItems:"center" }}>
            {[["accueil","Accueil"],["recherche","Rechercher un vol"],["services","Services"],["destinations","Djibouti"],["packages","Packages"],["agence","Contact"]].map(([id,label])=>(
              <button key={id} className="nav-link" onClick={()=>scrollTo(id)} style={{
                background:"none", border:"none", cursor:"pointer",
                color: activeSection===id ? T.sky : "rgba(255,255,255,0.8)",
                fontFamily:"inherit", fontSize:14, fontWeight:500, letterSpacing:0.5,
                transition:"color 0.2s", padding:"4px 0",
                borderBottom: activeSection===id ? `2px solid ${T.sky}` : "2px solid transparent",
              }}>{label}</button>
            ))}
          </div>
          <div className="desktop-nav-actions" style={{ display:"flex", gap:12 }}>
            <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 18px",
              background:"#25D366", color:"white", borderRadius:8,
              fontSize:13, fontWeight:600, textDecoration:"none", transition:"all 0.2s"
            }}>💬 WhatsApp</a>
            <button className="btn-gold" onClick={()=>scrollTo("packages")} style={{
              padding:"8px 20px", background:`linear-gradient(135deg,${T.gold},${T.goldD})`,
              color:"white", border:"none", borderRadius:8, fontSize:13, fontWeight:600,
              cursor:"pointer", transition:"all 0.2s"
            }}>Réserver →</button>
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Menu"
            style={{
              alignItems:"center", justifyContent:"center", width:40, height:40,
              background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8,
              cursor:"pointer", flexDirection:"column", gap:4,
            }}
          >
            <span style={{ width:20, height:2, background:"white", borderRadius:2, transition:"all 0.2s", transform: mobileMenuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span style={{ width:20, height:2, background:"white", borderRadius:2, opacity: mobileMenuOpen ? 0 : 1, transition:"all 0.2s" }} />
            <span style={{ width:20, height:2, background:"white", borderRadius:2, transition:"all 0.2s", transform: mobileMenuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div style={{
            background:"rgba(6,15,30,0.98)", backdropFilter:"blur(20px)",
            padding:"12px 20px 24px", display:"flex", flexDirection:"column", gap:4,
            borderTop:"1px solid rgba(255,255,255,0.08)",
          }}>
            {[["accueil","Accueil"],["recherche","Rechercher un vol"],["services","Services"],["destinations","Djibouti"],["packages","Packages"],["agence","Contact"]].map(([id,label])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{
                background:"none", border:"none", cursor:"pointer", textAlign:"left",
                color: activeSection===id ? T.sky : "rgba(255,255,255,0.85)",
                fontFamily:"inherit", fontSize:16, fontWeight:500,
                padding:"12px 4px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              }}>{label}</button>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
                flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"12px",
                background:"#25D366", color:"white", borderRadius:8,
                fontSize:14, fontWeight:600, textDecoration:"none",
              }}>💬 WhatsApp</a>
              <button onClick={()=>scrollTo("packages")} style={{
                flex:1, padding:"12px", background:`linear-gradient(135deg,${T.gold},${T.goldD})`,
                color:"white", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer",
              }}>Réserver →</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section id="accueil" className="hero-section" style={{ position:"relative", height:"100vh", minHeight:700, overflow:"hidden" }}>
        {/* Background */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=90')",
          backgroundSize:"cover", backgroundPosition:"center",
          transform:"scale(1.05)",
          animation:"float 20s ease-in-out infinite",
        }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(11,31,58,0.88) 0%, rgba(11,31,58,0.5) 50%, rgba(11,31,58,0.75) 100%)" }}/>

        {/* Contenu hero */}
        <div className="hero-content hero-flex" style={{ position:"relative", zIndex:2, maxWidth:1200, margin:"0 auto", padding:"0 40px", height:"100%", display:"flex", alignItems:"center" }}>
          <div style={{ maxWidth:680 }}>
            <h1 className="fade-up hero-title" style={{ animationDelay:"0.2s", fontFamily:"'Playfair Display', serif", fontSize:68, fontWeight:900, color:"#fff", lineHeight:1.05, marginBottom:24 }}>
              Votre Voyage<br/>
              <span style={{ color:T.sky }}>Commence</span><br/>
              à Djibouti
            </h1>

            <p className="fade-up" style={{ animationDelay:"0.3s", fontSize:18, color:"rgba(255,255,255,0.75)", lineHeight:1.7, marginBottom:40, maxWidth:520 }}>
              Vols internationaux, hôtels, Omra, packages touristiques. 
              Service personnalisé et de confiance.
            </p>

            <div className="fade-up" style={{ animationDelay:"0.4s", display:"flex", gap:16, flexWrap:"wrap" }}>
              <button className="btn-primary" onClick={()=>scrollTo("recherche")} style={{
                padding:"16px 36px", background:`linear-gradient(135deg,${T.blue},${T.blueL})`,
                color:"white", border:"none", borderRadius:12, fontSize:16, fontWeight:600,
                cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:8
              }}>✈️ Rechercher un vol</button>
              <button className="btn-gold" onClick={()=>scrollTo("destinations")} style={{
                padding:"16px 36px", background:`linear-gradient(135deg,${T.gold},${T.goldD})`,
                color:"white", border:"none", borderRadius:12, fontSize:16, fontWeight:600,
                cursor:"pointer", transition:"all 0.2s"
              }}>🌍 Découvrir Djibouti</button>
            </div>

            {/* Stats rapides */}
            <div className="fade-up hero-stats" style={{ animationDelay:"0.5s", display:"flex", gap:40, marginTop:52, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
              {STATS.slice(1,4).map(s=>(
                <div key={s.label}>
                  <div style={{ fontSize:28, fontWeight:900, color:T.sky, fontFamily:"'Playfair Display', serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte contact flottante */}
          <div className="fade-up hero-contact-card" style={{ animationDelay:"0.6s", marginLeft:"auto", background:"rgba(255,255,255,0.07)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:28, minWidth:260 }}>
            <div style={{ fontSize:12, color:T.sky, fontWeight:700, letterSpacing:2, marginBottom:16 }}>CONTACTEZ-NOUS</div>
            {[["📞","+253 21 25 07 17"],["📱","+253 77 64 64 05"],["✉️","reservations@alamintravel-dj.com"],["📍","Salines Ouest, Djibouti"],["🕐","Sam-Jeu 8h-20h"]].map(([icon,val])=>(
              <div key={val} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:15 }}>{icon}</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.8)", lineBreak:"anywhere" }}>{val}</span>
              </div>
            ))}
            <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
              display:"block", marginTop:16, padding:"10px", background:"#25D366",
              color:"white", borderRadius:10, textAlign:"center", fontSize:13,
              fontWeight:600, textDecoration:"none"
            }}>💬 Écrire sur WhatsApp</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", animation:"float 2s ease-in-out infinite" }}>
          <div style={{ width:1, height:48, background:"rgba(255,255,255,0.3)", margin:"0 auto" }}/>
          <div style={{ width:6, height:6, background:T.sky, borderRadius:"50%", margin:"4px auto 0" }}/>
        </div>
      </section>

      <FlightSearchWidget />

      {/* ══ CAROUSEL COMPAGNIES ══ */}
      <div style={{ background:T.navy, padding:"16px 0", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:`linear-gradient(to right,${T.navy},transparent)`, zIndex:2 }}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:`linear-gradient(to left,${T.navy},transparent)`, zIndex:2 }}/>
        <div className="al-track">
          {[...AIRLINES, ...AIRLINES].map((a, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", marginRight:32, flexShrink:0 }}>
              <div style={{ background:"white", borderRadius:10, padding:"8px 18px", height:44, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.15)" }}>
                <img src={a.logo} alt={a.name} style={{ height:24, maxWidth:110, width:"auto", objectFit:"contain" }} />
              </div>
              <span style={{ color:"rgba(255,255,255,0.2)", fontSize:20, marginLeft:20 }}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section id="services" style={{ padding:"96px 40px", background:T.gray50 }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"inline-block", background:`${T.blue}15`, color:T.blue, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>NOS SERVICES</div>
            <h2 className="section-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy, marginBottom:16 }}>
              Tout ce dont vous<br/>avez besoin pour voyager
            </h2>
            <p style={{ fontSize:16, color:T.gray500, maxWidth:500, margin:"0 auto", lineHeight:1.7 }}>
              De la réservation de vols à l'assistance visa, nous gérons chaque détail de votre voyage.
            </p>
          </div>

          <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="service-card" style={{
                background:"white", borderRadius:20, padding:32,
                boxShadow:"0 4px 24px rgba(11,31,58,0.06)",
                border:"1px solid rgba(11,31,58,0.06)",
                transition:"all 0.3s ease", cursor:"default"
              }}>
                <div style={{ width:56, height:56, borderRadius:16, background:`${s.color}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:20 }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:700, color:T.navy, marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:T.gray500, lineHeight:1.7 }}>{s.desc}</p>
                <div style={{ marginTop:20, color:s.color, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                  En savoir plus <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DESTINATIONS DJIBOUTI ══ */}
      <section id="destinations" style={{ padding:"96px 40px", background:"white" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="dest-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
            <div>
              <div style={{ display:"inline-block", background:`${T.gold}15`, color:T.goldD, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>TOURISME LOCAL</div>
              <h2 className="section-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy }}>
                Découvrez<br/><span style={{ color:T.blue }}>Djibouti</span>
              </h2>
            </div>
            <p style={{ fontSize:15, color:T.gray500, maxWidth:340, textAlign:"right", lineHeight:1.7 }}>
              Des paysages d'une beauté rare. Djibouti, carrefour entre mer Rouge et golfe d'Aden.
            </p>
          </div>

          <div className="dest-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"240px 240px", gap:16 }}>
            {DESTINATIONS.map((d, i) => (
              <div key={i} className="dest-card" style={{
                position:"relative", borderRadius:20, overflow:"hidden",
                gridRow: i===0 ? "span 2" : "auto",
                cursor:"pointer",
                boxShadow:"0 8px 32px rgba(0,0,0,0.12)"
              }}>
                <img className="dest-img" src={d.img} alt={d.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}/>
                <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top, ${d.color}ee 0%, ${d.color}44 50%, transparent 100%)` }}/>
                <div className="dest-overlay" style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.2)", opacity:0, transition:"opacity 0.3s" }}/>
                <div style={{ position:"absolute", top:16, left:16 }}>
                  <span style={{ background:`${T.gold}`, color:"white", fontSize:9, fontWeight:700, padding:"4px 10px", borderRadius:20, letterSpacing:1 }}>{d.tag}</span>
                </div>
                <div style={{ position:"absolute", bottom:20, left:20, right:20 }}>
                  <div style={{ fontFamily:"'Playfair Display', serif", fontSize:i===0?22:16, fontWeight:700, color:"white", marginBottom:4 }}>{d.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", lineHeight:1.5 }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PACKAGES ══ */}
      <section id="packages" style={{ padding:"96px 40px", background:`linear-gradient(135deg, ${T.navyD} 0%, ${T.navy} 100%)` }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"inline-block", background:"rgba(79,195,247,0.15)", color:T.sky, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>PACKAGES PHARES</div>
            <h2 className="section-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:"white", marginBottom:16 }}>Nos Meilleures Offres</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", maxWidth:500, margin:"0 auto" }}>Packages complets incluant vols, hébergement et accompagnement</p>
          </div>

          <div className="packages-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[
              { name:"Omra Premium", price:"198 500", duration:"21 jours", places:"30 places", tag:"POPULAIRE", img:"https://images.unsplash.com/photo-1591604328740-f52fc7af0f76?w=600&q=80", tagColor:T.gold },
              { name:"Omra Ramadan", price:"504 000", duration:"14 jours", places:"40 places", tag:"RAMADAN", img:"https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80", tagColor:"#E91E63" },
              { name:"Dubai City Break", price:"180 000", duration:"5 jours", places:"20 places", tag:"NOUVEAU", img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", tagColor:T.blue },
            ].map((p, i) => (
              <div key={i} style={{ borderRadius:20, overflow:"hidden", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.3s" }}>
                <div style={{ position:"relative", height:200, overflow:"hidden" }}>
                  <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))" }}/>
                  <div style={{ position:"absolute", top:12, left:12, background:p.tagColor, color:"white", fontSize:9, fontWeight:800, padding:"4px 10px", borderRadius:20, letterSpacing:1 }}>{p.tag}</div>
                </div>
                <div style={{ padding:24 }}>
                  <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontWeight:700, color:"white", marginBottom:8 }}>{p.name}</h3>
                  <div style={{ display:"flex", gap:16, marginBottom:16 }}>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>📅 {p.duration}</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>👥 {p.places}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span style={{ fontSize:22, fontWeight:800, color:T.sky, fontFamily:"'Playfair Display', serif" }}>{p.price}</span>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginLeft:4 }}>FDJ/pers.</span>
                    </div>
                    <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
                      padding:"10px 20px", background:`linear-gradient(135deg,${T.gold},${T.goldD})`,
                      color:"white", borderRadius:10, fontSize:13, fontWeight:600, textDecoration:"none"
                    }}>Réserver →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TÉMOIGNAGES ══ */}
      <section style={{ padding:"96px 40px", background:"white" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"inline-block", background:`${T.blue}15`, color:T.blue, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>TÉMOIGNAGES</div>
            <h2 className="section-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy }}>Ce que disent nos clients</h2>
          </div>

          <div className="testimonials-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{
                padding:36, borderRadius:20,
                background: i === activeTestimonial ? `linear-gradient(135deg,${T.navy},${T.blue})` : T.gray50,
                border: `1px solid ${i === activeTestimonial ? "transparent" : T.gray100}`,
                transition:"all 0.4s ease", cursor:"pointer"
              }} onClick={() => setActiveTestimonial(i)}>
                <div style={{ display:"flex", gap:4, marginBottom:16 }}>
                  {[...Array(t.stars)].map((_,j)=><span key={j} style={{ color:T.gold, fontSize:16 }}>★</span>)}
                </div>
                <p style={{ fontSize:15, lineHeight:1.8, color: i===activeTestimonial ? "rgba(255,255,255,0.85)" : T.gray700, marginBottom:24, fontStyle:"italic" }}>
                  "{t.text}"
                </p>
                <div>
                  <div style={{ fontWeight:700, color: i===activeTestimonial ? "white" : T.navy, fontSize:15 }}>{t.name}</div>
                  <div style={{ fontSize:12, color: i===activeTestimonial ? T.sky : T.gray500, marginTop:2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AGENCE & CARTE ══ */}
      <section id="agence" style={{ padding:"96px 40px", background:T.gray50 }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", background:`${T.gold}15`, color:T.goldD, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>NOTRE AGENCE</div>
            <h2 className="section-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy }}>Visitez-nous à Djibouti</h2>
          </div>

          <div className="agence-photos-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }}>
            {[
              { src:"/agence1.jpg.jpeg", label:"Notre façade", span:2 },
              { src:"/agence2.jpg.jpeg", label:"Notre bureau", span:1 },
              { src:"/agence5.jpg.jpeg", label:"Notre équipe", span:1 },
              { src:"/agence3.jpg.jpeg", label:"Espace travail", span:1 },
              { src:"/agence4.jpg.jpeg", label:"Vue extérieure", span:1 },
            ].map((p, i) => (
              <div key={i} style={{ gridColumn:`span ${p.span}`, borderRadius:16, overflow:"hidden", height:i===0?220:160, position:"relative", boxShadow:"0 4px 20px rgba(0,0,0,0.1)" }}>
                <img src={p.src} alt={p.label} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,0.6))", padding:"10px 14px" }}>
                  <span style={{ color:"white", fontSize:11, fontWeight:600 }}>{p.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="agence-info-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.1)", height:300 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5!2d43.1456!3d11.5886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQWxhbWluIFRvdXJpc20!5e0!3m2!1sfr!2sdj"
                width="100%" height="300" style={{ border:0 }} allowFullScreen loading="lazy" title="Alamin Tourism Djibouti"
              />
            </div>
            <div style={{ background:"white", borderRadius:20, padding:32, boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700, color:T.navy, marginBottom:24 }}>Informations pratiques</h3>
              {[
                ["📍","Adresse","Salines Ouest, Mohamed Kamil Road, Djibouti"],
                ["📞","Téléphone","+253 21 25 07 17"],
                ["📱","Mobile","+253 77 64 64 05"],
                ["✉️","Email","reservations@alamintravel-dj.com"],
                ["🕐","Horaires","Samedi–Jeudi : 8h00 – 20h00"],
                ["🌐","Site web","alamintravel-dj.com"],
              ].map(([icon,label,val])=>(
                <div key={label} style={{ display:"flex", gap:14, marginBottom:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:10, color:T.gray500, fontWeight:700, letterSpacing:1, marginBottom:2 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize:13, color:T.navy, fontWeight:500 }}>{val}</div>
                  </div>
                </div>
              ))}
              <a href="https://maps.google.com/?q=Alamin+Tourism+Travel+Djibouti" target="_blank" rel="noopener noreferrer" style={{
                display:"block", marginTop:20, padding:"12px", background:`linear-gradient(135deg,${T.blue},${T.blueL})`,
                color:"white", borderRadius:12, textAlign:"center", fontSize:14, fontWeight:600, textDecoration:"none"
              }}>🗺️ Ouvrir dans Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section style={{ padding:"80px 40px", background:`linear-gradient(135deg, ${T.blue} 0%, ${T.navy} 100%)`, textAlign:"center" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <h2 className="cta-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:"white", marginBottom:16 }}>
            Prêt à voyager ?
          </h2>
          <p style={{ fontSize:17, color:"rgba(255,255,255,0.7)", marginBottom:40, lineHeight:1.7 }}>
            Notre équipe est disponible 6 jours sur 7 pour vous aider à planifier le voyage parfait.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
              padding:"16px 40px", background:"#25D366", color:"white", borderRadius:12,
              fontSize:16, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:8
            }}>💬 Nous contacter sur WhatsApp</a>
            <a href="tel:+25321250717" style={{
              padding:"16px 40px", background:"rgba(255,255,255,0.1)", border:"2px solid rgba(255,255,255,0.3)",
              color:"white", borderRadius:12, fontSize:16, fontWeight:600, textDecoration:"none"
            }}>📞 +253 21 25 07 17</a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:T.navyD, padding:"48px 40px 24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
            <div>
              <Logo size={48} light />
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:16, lineHeight:1.8, maxWidth:280 }}>
                Votre partenaire de voyage de confiance à Djibouti. Agent IATA accrédité, spécialisé dans les vols internationaux, hôtels et packages Omra.
              </p>
              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                {["Facebook","Instagram","WhatsApp"].map(s=>(
                  <div key={s} style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:14 }}>
                    {s==="Facebook"?"f":s==="Instagram"?"📷":"💬"}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.sky, letterSpacing:2, marginBottom:20 }}>SERVICES</div>
              {["Billets d'avion","Hôtels","Omra","Location voiture","Assistance visa","Voyages organisés"].map(s=>(
                <div key={s} style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:10, cursor:"pointer" }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.sky, letterSpacing:2, marginBottom:20 }}>LIENS RAPIDES</div>
              {["Accueil","À propos","Packages","Destinations","Contact"].map(s=>(
                <div key={s} style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:10, cursor:"pointer" }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.sky, letterSpacing:2, marginBottom:20 }}>CONTACT</div>
              {["+253 21 25 07 17","+253 77 64 64 05","reservations@alamintravel-dj.com","Salines Ouest, Djibouti"].map(s=>(
                <div key={s} style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:10, lineBreak:"anywhere" }}>{s}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>© 2026 Alamin Tourism & Travel. Tous droits réservés. Agent IATA Accrédité.</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>alamintravel-dj.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
