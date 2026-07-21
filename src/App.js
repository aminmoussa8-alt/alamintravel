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
  { name:"Lac Assal", tag:"Incontournable", desc:"Le point le plus bas d'Afrique • 155m sous le niveau de la mer", img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Assal_1-Djibouti.jpg", color:"#0B4D68" },
  { name:"Lac Abbé", tag:"Aventure", desc:"Cheminées de calcaire • Paysage lunaire unique au monde", img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lac_Abbe.JPG", color:"#5C3A1E" },
  { name:"Requins baleines", tag:"Plongée", desc:"Golfe de Tadjoura • Novembre à Février", img:"https://commons.wikimedia.org/wiki/Special:FilePath/Whale_Shark_AdF.jpg", color:"#0D4A7A" },
  { name:"Ville de Djibouti", tag:"Culture", desc:"Capitale cosmopolite • Carrefour de l'Afrique et de l'Orient", img:"https://commons.wikimedia.org/wiki/Special:FilePath/An_aerial_view_of_Djibouti_City.jpg", color:"#1A237E" },
  { name:"Golfe de Tadjoura", tag:"Nature", desc:"Eaux turquoise • Faune marine exceptionnelle", img:"https://commons.wikimedia.org/wiki/Special:FilePath/%C3%8Ele_maskali,_Djibouti.jpg", color:"#01579B" },
];

// ── SERVICES ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { img:"https://commons.wikimedia.org/wiki/Special:FilePath/White_Plane_Blue_Sky.jpg", title:"Billets d'Avion", desc:"Vols internationaux depuis Djibouti. Meilleurs tarifs garantis.", color:"#1565C0" },
  { img:"https://commons.wikimedia.org/wiki/Special:FilePath/Hotel_room_interior_at_hotel_Radisson_Blu_Oulu.jpg", title:"Hôtels & Séjours", desc:"Sélection d'hôtels à Djibouti et dans le monde entier.", color:"#0D47A1" },
  { img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kaaba_%281%29_Makkah_%28Mecca%29.jpg", title:"Omra", desc:"Packages complets Omra. Accompagnement spirituel.", color:"#4527A0" },
  { img:"https://commons.wikimedia.org/wiki/Special:FilePath/Car_rental_facility_near_DIA_filled_with_cars_during_the_pandemic._2020-04-30.jpg", title:"Location de Voitures", desc:"Véhicules disponibles à Djibouti. Chauffeurs expérimentés.", color:"#006064" },
  { img:"https://commons.wikimedia.org/wiki/Special:FilePath/My_collection_of_passport_stamps.jpg", title:"Visa & Documents", desc:"Assistance visa pour toutes destinations. Traitement rapide.", color:"#1B5E20" },
  { img:"https://commons.wikimedia.org/wiki/Special:FilePath/Man_looking_for_new_travel_destinations_on_the_world_map.jpg", title:"Voyages Organisés", desc:"Circuits à Djibouti et en Afrique de l'Est. Groupes et individuels.", color:"#E65100" },
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
  { name:"Turkish Airlines", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Turkish_Airlines_logo_2019_compact.svg" },
  { name:"Air France", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Air_France_Logo.svg" },
  { name:"Kenya Airways", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Kenya_Airways_Logo.svg" },
  { name:"Saudia", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Saudia_logo_2023.png" },
  { name:"IATA", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/IATA_logo.svg" },
];

// ── ICÔNE WHATSAPP (SVG officielle) ───────────────────────────────────────────
const WhatsAppIcon = ({ size = 18, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12.001 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.489 1.34 5.007L2.06 21.998l5.13-1.246a9.96 9.96 0 004.81 1.226h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.929-7.07a9.933 9.933 0 00-7.07-2.908zm0 18.174h-.003a8.28 8.28 0 01-4.216-1.156l-.303-.18-3.043.784.812-2.968-.198-.305a8.283 8.283 0 01-1.267-4.408c0-4.583 3.729-8.313 8.32-8.313 2.222 0 4.31.868 5.879 2.44a8.26 8.26 0 012.436 5.878c0 4.583-3.73 8.229-8.417 8.229z"/>
  </svg>
);

// ── ICÔNES DU WIDGET DE RECHERCHE (traits fins, cohérentes avec la charte) ───
const SearchIcons = {
  takeoff: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 19h19"/><path d="M17 19l-5.5-11L6 10.5"/><path d="M11.5 8L21 5"/></svg>,
  landing: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 19h19"/><path d="M4 14l7-3 9 4-3 3-6-1.5-5 2z"/></svg>,
  calendar: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  users: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><path d="M16 8.2a3 3 0 010 5.9M19.5 20c0-2.8-1.7-4.8-4-5.4"/></svg>,
  search: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  swap: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/></svg>,
  plus: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  trash: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/></svg>,
  ticket: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4V8z"/><path d="M14 6v12" strokeDasharray="2 3"/></svg>,
};


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
    .cta-split { grid-template-columns:1fr !important; }
  }

  @media (max-width: 480px) {
    .footer-grid { grid-template-columns:1fr !important; }
    .hero-title { font-size:30px !important; }
    .section-title { font-size:26px !important; }
    .flight-search-form { flex-direction:column !important; }
    .flight-search-form > div, .flight-search-form > button[type="submit"] { width:100% !important; }
    .flight-search-form input, .flight-search-form select, .flight-search-form button:not([title="Inverser"]) {
      width:100% !important; min-width:0 !important;
    }
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// RECHERCHE & RÉSERVATION DE VOLS (Ethiopian Airlines - API NDC directe)
// ══════════════════════════════════════════════════════════════════════════════
const inputStyle = {
  flex: 1, minWidth: 130, padding: "13px 16px", border: `1px solid ${T.gray300}`,
  borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: T.navy, background: "white",
};

// ── SÉLECTEUR DE DATE (calendrier français, remplace les inputs natifs jj/mm/aaaa) ──
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_FR = ["D","L","M","M","J","V","S"];

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromISO(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatShort(s) {
  const d = fromISO(s);
  if (!d) return null;
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()].slice(0, 3).toLowerCase()}`;
}
function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay(); // dimanche = 0, comme le calendrier Ethiopian
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function DatePickerField({ mode, value, onChangeSingle, startValue, endValue, onChangeRange, label }) {
  const [open, setOpen] = useState(false);
  const today = startOfDay(new Date());
  const initialRef = mode === "single" ? (fromISO(value) || today) : (fromISO(startValue) || today);
  const [viewYear, setViewYear] = useState(initialRef.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialRef.getMonth());
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selStart = mode === "range" ? fromISO(startValue) : fromISO(value);
  const selEnd = mode === "range" ? fromISO(endValue) : null;
  const pickingReturn = mode === "range" && !!selStart && !selEnd;

  function goMonth(delta) {
    let m = viewMonth + delta, y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function handlePick(day) {
    if (!day || day < today) return;
    if (mode === "single") {
      onChangeSingle(toISO(day));
      setOpen(false);
      return;
    }
    // Mode aller-retour : ne ferme plus automatiquement — l'utilisateur confirme via le bouton
    if (!selStart || (selStart && selEnd) || day < selStart) {
      onChangeRange(toISO(day), null);
    } else {
      onChangeRange(toISO(selStart), toISO(day));
    }
  }

  function resetToPickStart() {
    if (mode === "range") onChangeRange(null, null);
  }

  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());
  const hasValue = mode === "single" ? !!value : !!startValue;
  const displayLabel = mode === "single"
    ? (formatShort(value) || label || "Date")
    : (startValue ? `${formatShort(startValue)}${endValue ? " — " + formatShort(endValue) : ""}` : (label || "Dates"));

  // Un mois pour l'aller simple / multi-destinations, deux mois côte à côte pour l'aller-retour
  const monthsToShow = mode === "range" ? [0, 1] : [0];

  function renderMonthCard(offset) {
    let m = viewMonth + offset, y = viewYear;
    if (m > 11) { m -= 12; y += 1; }
    const weeks = buildMonthGrid(y, m);
    return (
      <div key={offset} style={{ minWidth: 220, flex: "1 1 220px" }}>
        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 700, color: T.navy, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
          {MONTHS_FR[m]} {y}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 2 }}>
          {DAYS_FR.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: T.gray500, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} />;
              const disabled = day < today;
              const isStart = selStart && isSameDay(day, selStart);
              const isEnd = selEnd && isSameDay(day, selEnd);
              const inRange = mode === "range" && selStart && selEnd && day > selStart && day < selEnd;
              let bg = "transparent", color = T.navy, fontWeight = 500, radius = 8;
              if (isStart || isEnd) { bg = T.blue; color = "white"; fontWeight = 700; }
              else if (inRange) { bg = `${T.blue}18`; color = T.navy; radius = 0; }
              return (
                <button key={di} type="button" disabled={disabled} onClick={() => handlePick(day)} style={{
                  border: "none", background: bg, color: disabled ? T.gray300 : color, fontWeight,
                  borderRadius: radius, height: 30, margin: "1px 0", fontSize: 12, cursor: disabled ? "default" : "pointer",
                  fontFamily: "inherit",
                }}>{day.getDate()}</button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{
        display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer",
        width: "100%", padding: 0, fontFamily: "inherit", textAlign: "left",
      }}>
        {SearchIcons.calendar({ size: 15, color: T.gray500 })}
        <span style={{ fontSize: 13.5, fontWeight: 600, color: hasValue ? T.navy : T.gray500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {displayLabel}
        </span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", left: 0, zIndex: 50,
          background: "white", borderRadius: 16, boxShadow: "0 12px 40px rgba(11,31,58,0.18)",
          border: `1px solid ${T.gray100}`, padding: 18, width: mode === "range" ? 460 : 260,
          maxWidth: "94vw", boxSizing: "border-box",
        }}>
          {mode === "range" && (
            <div style={{ display: "flex", borderBottom: `1px solid ${T.gray100}`, marginBottom: 14 }}>
              <button type="button" onClick={resetToPickStart} style={{
                flex: 1, textAlign: "center", padding: "0 0 10px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, color: !pickingReturn ? T.blue : T.gray500,
                borderBottom: !pickingReturn ? `2px solid ${T.blue}` : "2px solid transparent", marginBottom: -1,
              }}>DÉPART{selStart ? ` · ${formatShort(startValue)}` : ""}</button>
              <div style={{
                flex: 1, textAlign: "center", padding: "0 0 10px", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5,
                color: pickingReturn ? T.blue : (selEnd ? T.navy : T.gray300),
                borderBottom: pickingReturn ? `2px solid ${T.blue}` : "2px solid transparent", marginBottom: -1,
              }}>RETOUR{selEnd ? ` · ${formatShort(endValue)}` : ""}</div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button type="button" onClick={() => canGoPrev && goMonth(-1)} disabled={!canGoPrev} style={{
              border: `1px solid ${T.gray300}`, background: "white", cursor: canGoPrev ? "pointer" : "default", color: canGoPrev ? T.navy : T.gray300,
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontFamily: "inherit",
            }}>‹</button>
            <div style={{ fontSize: 11, color: T.gray500 }}>
              {mode === "range" ? "Cliquez le départ, puis le retour" : "Sélectionnez une date"}
            </div>
            <button type="button" onClick={() => goMonth(1)} style={{
              border: `1px solid ${T.gray300}`, background: "white", cursor: "pointer", color: T.navy,
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontFamily: "inherit",
            }}>›</button>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {monthsToShow.map((offset) => renderMonthCard(offset))}
          </div>

          {mode === "range" && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.gray100}` }}>
              <button type="button" onClick={() => setOpen(false)} disabled={!selStart || !selEnd} style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: (selStart && selEnd) ? "pointer" : "default",
                background: (selStart && selEnd) ? T.blue : T.gray100, color: (selStart && selEnd) ? "white" : T.gray500,
                fontSize: 12.5, fontWeight: 700, fontFamily: "inherit",
              }}>Confirmer</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FlightSearchWidget() {
  const [tripType, setTripType] = useState("roundtrip"); // roundtrip | oneway | multi | manage
  const [form, setForm] = useState({ origin: "", destination: "", departureDate: "", returnDate: "", passengers: "1" });
  const [multiSlices, setMultiSlices] = useState([
    { origin: "", destination: "", departureDate: "" },
    { origin: "", destination: "", departureDate: "" },
  ]);
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [customer, setCustomer] = useState({
    name: "", phone: "", email: "", notes: "",
    birthdate: "", gender: "Male", idNumber: "", issuingCountry: "DJ", expiryDate: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [manageForm, setManageForm] = useState({ reference: "", lastName: "", phone: "" });
  const [manageSent, setManageSent] = useState(false);

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: id === "origin" || id === "destination" ? value.toUpperCase() : value }));
  }

  function swapOriginDestination() {
    setForm((f) => ({ ...f, origin: f.destination, destination: f.origin }));
  }

  function updateMultiSlice(index, field, value) {
    setMultiSlices((prev) => prev.map((s, i) => i === index
      ? { ...s, [field]: (field === "origin" || field === "destination") ? value.toUpperCase() : value }
      : s));
  }

  function addMultiSlice() {
    setMultiSlices((prev) => [...prev, { origin: "", destination: "", departureDate: "" }]);
  }

  function removeMultiSlice(index) {
    setMultiSlices((prev) => prev.length > 2 ? prev.filter((_, i) => i !== index) : prev);
  }

  function selectTripType(type) {
    setTripType(type);
    setOffers(null);
    setError("");
  }

  function handleManageSubmit(e) {
    e.preventDefault();
    if (!manageForm.reference.trim() || !manageForm.lastName.trim()) {
      alert("Merci de remplir la référence et le nom.");
      return;
    }
    const message = `Bonjour, je souhaite gérer ma réservation.\nRéférence : ${manageForm.reference}\nNom : ${manageForm.lastName}\nTéléphone : ${manageForm.phone || "-"}`;
    window.open(`https://wa.me/25377646406?text=${encodeURIComponent(message)}`, "_blank");
    setManageSent(true);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (tripType === "multi") {
      const incomplete = multiSlices.some((s) => !s.origin || !s.destination || !s.departureDate);
      if (incomplete) { alert("Merci de renseigner l'origine, la destination et la date pour chaque vol."); return; }
    } else {
      if (!form.origin || !form.destination || !form.departureDate) {
        alert("Merci de renseigner l'origine, la destination et la date de départ.");
        return;
      }
      if (tripType === "roundtrip" && !form.returnDate) {
        alert("Merci de sélectionner une date de retour.");
        return;
      }
    }
    setLoading(true);
    setError("");
    setOffers(null);
    try {
      const payload = tripType === "multi"
        ? { slices: multiSlices, passengers: form.passengers }
        : {
            origin: form.origin,
            destination: form.destination,
            departureDate: form.departureDate,
            returnDate: tripType === "roundtrip" ? (form.returnDate || undefined) : undefined,
            passengers: form.passengers,
          };
     const resp = await fetch("/api/search-flights-ethiopian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    setCustomer({
      name: "", phone: "", email: "", notes: "",
      birthdate: "", gender: "Male", idNumber: "", issuingCountry: "DJ", expiryDate: "",
    });
  }

  async function handleReserve() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert("Merci de remplir au moins le nom et le téléphone.");
      return;
    }
    if (!customer.birthdate || !customer.idNumber.trim() || !customer.expiryDate) {
      alert("Merci de remplir la date de naissance, le numéro de passeport et sa date d'expiration (obligatoires pour Ethiopian Airlines).");
      return;
    }
    setSending(true);
    try {
      const nameParts = customer.name.trim().split(/\s+/);
      const givenName = nameParts[0] || "N/A";
      const surname = nameParts.slice(1).join(" ") || nameParts[0] || "N/A";

      const resp = await fetch("/api/reserve-ethiopian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId: selectedOffer.responseId,
          offerId: selectedOffer.offerId,
          offerItemId: selectedOffer.offerItemId,
          totalAmount: selectedOffer.totalAmount,
          currency: selectedOffer.currency,
          passenger: {
            ptc: "ADT",
            birthdate: customer.birthdate,
            gender: customer.gender,
            title: customer.gender === "Female" ? "MRS" : "MR",
            givenName,
            surname,
            idNumber: customer.idNumber,
            idType: "P",
            issuingCountry: customer.issuingCountry,
            citizenshipCountry: customer.issuingCountry,
            issueDate: new Date().toISOString().slice(0, 10),
            expiryDate: customer.expiryDate,
            phone: customer.phone,
            phoneCountryCode: "253",
            email: customer.email || undefined,
          },
        }),
      });
      const data = await resp.json();
      if (data.orderId) setSent(true);
      else alert("Erreur lors de l'envoi de la demande, réessayez. " + (data.error || ""));
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

        {/* Onglets externes, comme les vrais sites de compagnies (Air France, Turkish Airlines) */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 14 }}>
          {[
            ["book", "Réserver un vol"],
            ["manage", "Gérer ma réservation"],
          ].map(([key, label]) => {
            const active = (key === "manage") ? tripType === "manage" : tripType !== "manage";
            return (
              <button key={key} type="button"
                onClick={() => selectTripType(key === "manage" ? "manage" : "roundtrip")}
                style={{
                  padding: "10px 22px", border: "none", borderRadius: "10px 10px 0 0",
                  background: active ? "white" : "transparent", color: active ? T.navy : "rgba(11,31,58,0.5)",
                  fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer",
                  borderBottom: active ? `3px solid ${T.gold}` : "3px solid transparent",
                }}>{label}</button>
            );
          })}
        </div>

        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(11,31,58,0.1)", border: `1px solid ${T.gray100}`, marginBottom: 32, overflow: "hidden" }}>

          {/* Type de vol (uniquement en mode Réserver) */}
          {tripType !== "manage" && (
            <div style={{ display: "flex", gap: 22, alignItems: "center", padding: "16px 24px", borderBottom: `1px solid ${T.gray100}`, flexWrap: "wrap" }}>
              {[
                ["roundtrip", "Aller-retour"],
                ["oneway", "Aller simple"],
                ["multi", "Multi-destination"],
              ].map(([key, label]) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13.5, fontWeight: tripType === key ? 700 : 500, color: tripType === key ? T.navy : T.gray500 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%", border: `2px solid ${tripType === key ? T.blue : T.gray300}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {tripType === key && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue }} />}
                  </span>
                  <input type="radio" name="tripType" checked={tripType === key} onChange={() => selectTripType(key)} style={{ display: "none" }} />
                  {label}
                </label>
              ))}
            </div>
          )}

          <div style={{ padding: 24 }}>

          {tripType === "manage" ? (
            <form onSubmit={handleManageSubmit} style={{ padding: 28, maxWidth: 440, margin: "0 auto" }}>
              {manageSent ? (
                <p style={{ color: T.navy, fontWeight: 700, textAlign: "center", lineHeight: 1.6 }}>
                  ✅ Ta demande a été envoyée sur WhatsApp. Notre équipe te répond rapidement.
                </p>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: T.gray500, marginBottom: 20, textAlign: "center" }}>
                    Entre les infos de ta réservation, on te répond directement sur WhatsApp.
                  </p>
                  <input placeholder="Référence de réservation" required value={manageForm.reference}
                    onChange={(e) => setManageForm((m) => ({ ...m, reference: e.target.value }))}
                    style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
                  <input placeholder="Nom de famille" required value={manageForm.lastName}
                    onChange={(e) => setManageForm((m) => ({ ...m, lastName: e.target.value }))}
                    style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
                  <input type="tel" placeholder="Téléphone (optionnel)" value={manageForm.phone}
                    onChange={(e) => setManageForm((m) => ({ ...m, phone: e.target.value }))}
                    style={{ ...inputStyle, width: "100%", marginBottom: 18, boxSizing: "border-box" }} />
                  <button type="submit" style={{
                    width: "100%", padding: 14, background: "#25D366", color: "white",
                    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}><WhatsAppIcon size={16}/> Envoyer sur WhatsApp</button>
                </>
              )}
            </form>
          ) : tripType === "multi" ? (
            <form onSubmit={handleSearch}>
              {multiSlices.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14, paddingBottom: 14, borderBottom: i < multiSlices.length - 1 ? `1px solid ${T.gray100}` : "none" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: `${T.blue}12`, color: T.blue, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: "1 1 100px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.gray300}`, borderRadius: 10, padding: "10px 12px" }}>
                    {SearchIcons.takeoff({ size: 15, color: T.gray500 })}
                    <input placeholder="Origine (JIB)" maxLength={3} required value={s.origin}
                      onChange={(e) => updateMultiSlice(i, "origin", e.target.value)}
                      style={{ border: "none", outline: "none", width: "100%", fontSize: 14, fontWeight: 600, color: T.navy, textTransform: "uppercase", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ flex: "1 1 100px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.gray300}`, borderRadius: 10, padding: "10px 12px" }}>
                    {SearchIcons.landing({ size: 15, color: T.gray500 })}
                    <input placeholder="Destination (CDG)" maxLength={3} required value={s.destination}
                      onChange={(e) => updateMultiSlice(i, "destination", e.target.value)}
                      style={{ border: "none", outline: "none", width: "100%", fontSize: 14, fontWeight: 600, color: T.navy, textTransform: "uppercase", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ flex: "1 1 140px", display: "flex", alignItems: "center", border: `1px solid ${T.gray300}`, borderRadius: 10, padding: "10px 12px" }}>
                    <DatePickerField
                      mode="single"
                      value={s.departureDate}
                      onChangeSingle={(d) => updateMultiSlice(i, "departureDate", d)}
                      label="Date"
                    />
                  </div>
                  {multiSlices.length > 2 && (
                    <button type="button" onClick={() => removeMultiSlice(i)} style={{
                      border: "none", background: "none", color: "#B00020", cursor: "pointer", padding: 6, display: "flex",
                    }}>{SearchIcons.trash({ size: 16, color: "#B00020" })}</button>
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                <button type="button" onClick={addMultiSlice} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, border: `1px dashed ${T.blue}`, background: "none",
                  color: T.blue, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>{SearchIcons.plus({ size: 13 })} Ajouter un vol</button>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.gray300}`, borderRadius: 10, padding: "10px 12px" }}>
                  {SearchIcons.users({ size: 15, color: T.gray500 })}
                  <select id="passengers" value={form.passengers} onChange={handleChange} style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 600, color: T.navy, fontFamily: "inherit", background: "transparent" }}>
                    <option value="1">1 passager</option>
                    <option value="2">2 passagers</option>
                    <option value="3">3 passagers</option>
                    <option value="4">4 passagers</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} style={{
                  marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "13px 30px", background: `linear-gradient(135deg,${T.blue},${T.blueL})`,
                  color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>{SearchIcons.search({ size: 15, color: "white" })} {loading ? "Recherche…" : "Rechercher"}</button>
              </div>
            </form>
          ) : (
          <form onSubmit={handleSearch} className="flight-search-form" style={{
            display: "flex", flexWrap: "wrap", gap: 12, alignItems: "stretch",
          }}>
            {/* Pilule Origine ⇄ Destination */}
            <div style={{
              flex: "2 1 320px", display: "flex", alignItems: "stretch", border: `1.5px solid ${T.gray300}`,
              borderRadius: 100, overflow: "hidden", background: "white",
            }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", minWidth: 0 }}>
                {SearchIcons.takeoff({ size: 15, color: T.gray500 })}
                <input id="origin" placeholder="Origine (JIB)" maxLength={3} required
                  value={form.origin} onChange={handleChange}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: 15, fontWeight: 600, color: T.navy, textTransform: "uppercase", fontFamily: "inherit" }} />
              </div>
              <button type="button" onClick={swapOriginDestination} title="Inverser" style={{
                border: `1.5px solid ${T.gray300}`, background: "white", color: T.blue, width: 32, height: 32, alignSelf: "center",
                borderRadius: "50%", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(11,31,58,0.1)",
              }}>{SearchIcons.swap({ size: 13, color: T.blue })}</button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", minWidth: 0 }}>
                {SearchIcons.landing({ size: 15, color: T.gray500 })}
                <input id="destination" placeholder="Destination (CDG)" maxLength={3} required
                  value={form.destination} onChange={handleChange}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: 15, fontWeight: 600, color: T.navy, textTransform: "uppercase", fontFamily: "inherit" }} />
              </div>
            </div>

            {/* Pilule Dates */}
            <div style={{
              flex: "1.5 1 220px", display: "flex", alignItems: "center", border: `1.5px solid ${T.gray300}`,
              borderRadius: 100, padding: "14px 18px", background: "white",
            }}>
              {tripType === "roundtrip" ? (
                <DatePickerField
                  mode="range"
                  startValue={form.departureDate}
                  endValue={form.returnDate}
                  onChangeRange={(start, end) => setForm((f) => ({ ...f, departureDate: start, returnDate: end || "" }))}
                  label="Aller — Retour"
                />
              ) : (
                <DatePickerField
                  mode="single"
                  value={form.departureDate}
                  onChangeSingle={(d) => setForm((f) => ({ ...f, departureDate: d }))}
                  label="Date de départ"
                />
              )}
            </div>

            {/* Pilule Passagers */}
            <div style={{
              flex: "1 1 150px", display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${T.gray300}`,
              borderRadius: 100, padding: "14px 18px", background: "white",
            }}>
              {SearchIcons.users({ size: 15, color: T.gray500 })}
              <select id="passengers" value={form.passengers} onChange={handleChange}
                style={{ border: "none", outline: "none", width: "100%", fontSize: 13, fontWeight: 600, color: T.navy, fontFamily: "inherit", background: "transparent" }}>
                <option value="1">1 passager</option>
                <option value="2">2 passagers</option>
                <option value="3">3 passagers</option>
                <option value="4">4 passagers</option>
              </select>
            </div>

            {/* Bouton Rechercher */}
            <button type="submit" className="btn-primary" disabled={loading} style={{
              flex: "1 1 160px", padding: "0 30px", background: `linear-gradient(135deg,${T.blue},${T.blueL})`,
              color: "white", border: "none", borderRadius: 100, fontSize: 15, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: `0 6px 20px ${T.blue}40`,
            }}>{SearchIcons.search({ size: 16, color: "white" })} {loading ? "Recherche…" : "Rechercher"}</button>
          </form>
          )}
          </div>
        </div>

        {error && <p style={{ color: "#B00020", textAlign: "center" }}>Erreur : {error}</p>}
        {offers && offers.length === 0 && <p style={{ textAlign: "center", color: T.gray500 }}>Aucun vol trouvé pour ces critères.</p>}

        {offers && offers.map((offer) => {
          const depDateTime = offer.departureDate && offer.departureTime ? `${offer.departureDate}T${offer.departureTime}` : null;
          const arrDateTime = offer.arrivalDate && offer.arrivalTime ? `${offer.arrivalDate}T${offer.arrivalTime}` : null;
          return (
            <div key={offer.offerItemId} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
              background: "white", borderRadius: 16, padding: 20, marginBottom: 14,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: `1px solid ${T.gray100}`,
            }}>
              <div>
                <div style={{ fontWeight: 700, color: T.navy, fontSize: 15 }}>{offer.airline} — {offer.departureAirport} → {offer.arrivalAirport}</div>
                <div style={{ fontSize: 12, color: T.gray500, marginTop: 4 }}>
                  {depDateTime ? `Départ ${new Date(depDateTime).toLocaleString("fr-FR")}` : "Horaire à confirmer"}
                  {arrDateTime ? ` — Arrivée ${new Date(arrDateTime).toLocaleString("fr-FR")}` : ""}
                  {" "}({offer.stops > 0 ? `${offer.stops} escale(s)` : "direct"})
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: T.blue, fontSize: 18, fontFamily: "'Playfair Display', serif" }}>{offer.totalAmount} {offer.currency}</div>
                <div style={{ fontSize: 10, color: T.gray500, marginTop: 2 }}>Prix Ethiopian Airlines</div>
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
                  {selectedOffer.airline} — {selectedOffer.departureAirport} → {selectedOffer.arrivalAirport} — {selectedOffer.totalAmount} {selectedOffer.currency}
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

                <div style={{ fontSize: 11, color: T.gray500, marginBottom: 6, marginTop: 4 }}>Requis par Ethiopian Airlines pour l'émission du billet :</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input type="date" placeholder="Date de naissance" required value={customer.birthdate}
                    onChange={(e) => setCustomer((c) => ({ ...c, birthdate: e.target.value }))}
                    style={{ ...inputStyle, flex: 1, boxSizing: "border-box" }} />
                  <select value={customer.gender}
                    onChange={(e) => setCustomer((c) => ({ ...c, gender: e.target.value }))}
                    style={{ ...inputStyle, flex: 1, boxSizing: "border-box" }}>
                    <option value="Male">Homme</option>
                    <option value="Female">Femme</option>
                  </select>
                </div>
                <input placeholder="Numéro de passeport" required value={customer.idNumber}
                  onChange={(e) => setCustomer((c) => ({ ...c, idNumber: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input placeholder="Pays émetteur (ex: DJ)" required maxLength={2} value={customer.issuingCountry}
                    onChange={(e) => setCustomer((c) => ({ ...c, issuingCountry: e.target.value.toUpperCase().slice(0, 2) }))}
                    style={{ ...inputStyle, flex: 1, boxSizing: "border-box" }} />
                  <input type="date" placeholder="Expiration passeport" required value={customer.expiryDate}
                    onChange={(e) => setCustomer((c) => ({ ...c, expiryDate: e.target.value }))}
                    style={{ ...inputStyle, flex: 1, boxSizing: "border-box" }} />
                </div>
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
            }}><WhatsAppIcon size={16}/> WhatsApp</a>
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
              }}><WhatsAppIcon size={16}/> WhatsApp</a>
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
            {[["📞","+253 21 25 07 17"],["📱","+253 77 64 64 06"],["✉️","reservations@alamintravel-dj.com"],["📍","Salines Ouest, Djibouti"],["🕐","Sam-Jeu 8h-20h"]].map(([icon,val])=>(
              <div key={val} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:15 }}>{icon}</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.8)", lineBreak:"anywhere" }}>{val}</span>
              </div>
            ))}
            <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
              display:"block", marginTop:16, padding:"10px", background:"#25D366",
              color:"white", borderRadius:10, textAlign:"center", fontSize:13,
              fontWeight:600, textDecoration:"none"
              }}><WhatsAppIcon size={14}/> Écrire sur WhatsApp</a>
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
      <div style={{ background:"white", padding:"40px 0 20px", overflow:"hidden", position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <span style={{ fontFamily:"'Playfair Display', serif", color:T.navy, fontSize:32, fontWeight:700, letterSpacing:1 }}>Nos partenaires</span>
        </div>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,white,transparent)", zIndex:2 }}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,white,transparent)", zIndex:2 }}/>
        <div className="al-track">
          {[...AIRLINES, ...AIRLINES].map((a, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", marginRight:32, flexShrink:0 }}>
              <div style={{ background:T.gray50, border:`1px solid ${T.gray100}`, borderRadius:10, padding:"6px 10px", height:60, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(11,31,58,0.06)" }}>
                <img src={a.logo} alt={a.name} style={{ height:42, maxWidth:150, width:"auto", objectFit:"contain" }} />
              </div>
              <span style={{ color:"rgba(11,31,58,0.15)", fontSize:20, marginLeft:20 }}>·</span>
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
                position:"relative", background:"white", borderRadius:20,
                boxShadow:"0 4px 24px rgba(11,31,58,0.06)",
                border:"1px solid rgba(11,31,58,0.06)",
                transition:"all 0.3s ease", cursor:"default", overflow:"hidden",
              }}>
                <div style={{ position:"relative", height:160, overflow:"hidden" }}>
                  <img src={s.img} alt={s.title} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, transparent 40%, ${s.color}CC 100%)` }}/>
                  <div style={{ position:"absolute", bottom:12, left:20, right:20 }}>
                    <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:700, color:"white" }}>{s.title}</h3>
                  </div>
                </div>
                <div style={{ padding:"24px 28px 28px" }}>
                  <p style={{ fontSize:14, color:T.gray500, lineHeight:1.7 }}>{s.desc}</p>
                  <div style={{ marginTop:20, color:s.color, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                    En savoir plus <span>→</span>
                  </div>
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
                <img className="dest-img" src={d.img} alt={d.name} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}/>
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
              { name:"Omra Premium", price:"198 500", duration:"21 jours", places:"30 places", tag:"POPULAIRE", img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kaaba_%281%29_Makkah_%28Mecca%29.jpg", tagColor:T.gold },
              { name:"Omra Ramadan", price:"265 000", duration:"14 jours", places:"40 places", tag:"RAMADAN", img:"https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Nabawi_The_Prophet's_Mosque,_Madina.jpg", tagColor:"#E91E63" },
              { name:"Dubai City Break", price:"180 000", duration:"5 jours", places:"20 places", tag:"NOUVEAU", img:"https://commons.wikimedia.org/wiki/Special:FilePath/Dubai_Skyline_2016.jpg", tagColor:T.blue },
            ].map((p, i) => (
              <div key={i} style={{ borderRadius:20, overflow:"hidden", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.3s" }}>
                <div style={{ position:"relative", height:200, overflow:"hidden" }}>
                  <img src={p.img} alt={p.name} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
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
                <img src={p.src} alt={p.label} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
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
                ["📱","Mobile","+253 77 64 64 06"],
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
      <section style={{ background:T.gray50 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:420 }} className="cta-split">
          {/* Colonne gauche — texte */}
          <div style={{ padding:"72px 56px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#25D366" }}/>
              <span style={{ fontSize:12, fontWeight:700, color:T.gray500, letterSpacing:2 }}>ÉQUIPE DISPONIBLE MAINTENANT</span>
            </div>
            <h2 className="cta-title" style={{ fontFamily:"'Playfair Display', serif", fontSize:44, fontWeight:700, color:T.navy, marginBottom:20, lineHeight:1.15 }}>
              Prêt à voyager ?
            </h2>
            <p style={{ fontSize:16, color:T.gray500, marginBottom:36, lineHeight:1.7, maxWidth:420 }}>
              Décrivez-nous votre projet de voyage — vols, hôtels, Omra ou packages — et notre équipe s'occupe du reste, 6 jours sur 7.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{
                padding:"15px 30px", background:"#25D366", color:"white", borderRadius:100,
                fontSize:15, fontWeight:700, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8,
              }}><WhatsAppIcon size={18}/> WhatsApp</a>
              <a href="tel:+25321250717" style={{
                padding:"15px 30px", background:"white", border:`1.5px solid ${T.gray300}`,
                color:T.navy, borderRadius:100, fontSize:15, fontWeight:600, textDecoration:"none",
                display:"inline-flex", alignItems:"center", gap:8,
              }}>📞 +253 21 25 07 17</a>
            </div>
          </div>

          {/* Colonne droite — image + carte flottante */}
          <div style={{ position:"relative", minHeight:320, backgroundImage:"url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&q=85')", backgroundSize:"cover", backgroundPosition:"center" }}>
            <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${T.navy}55, ${T.blue}30)` }}/>
            <div style={{ position:"absolute", bottom:28, left:28, right:28, background:"white", borderRadius:16, padding:20, boxShadow:"0 10px 40px rgba(0,0,0,0.2)", display:"flex", gap:16 }}>
              <div style={{ flex:1, textAlign:"center", borderRight:`1px solid ${T.gray100}` }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.blue, fontFamily:"'Playfair Display', serif" }}>6j/7</div>
                <div style={{ fontSize:10, color:T.gray500 }}>Disponibilité</div>
              </div>
              <div style={{ flex:1, textAlign:"center", borderRight:`1px solid ${T.gray100}` }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.blue, fontFamily:"'Playfair Display', serif" }}>&lt;1h</div>
                <div style={{ fontSize:10, color:T.gray500 }}>Réponse</div>
              </div>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.blue, fontFamily:"'Playfair Display', serif" }}>IATA</div>
                <div style={{ fontSize:10, color:T.gray500 }}>Accrédité</div>
              </div>
            </div>
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
                <a href="https://wa.me/25377646406" target="_blank" rel="noopener noreferrer" style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                  <WhatsAppIcon size={15}/>
                </a>
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
              {["+253 21 25 07 17","+253 77 64 64 06","reservations@alamintravel-dj.com","Salines Ouest, Djibouti"].map(s=>(
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
