import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────────
const C = {
  navy: "#0a1628",
  navyDark: "#060e1a",
  navyLight: "#132238",
  blue: "#1a6eb5",
  blueDark: "#0f52a0",
  blueLight: "#4da3e8",
  gold: "#d4af37",
  white: "#ffffff",
  offWhite: "#f8f9fb",
  gray50: "#f3f4f6",
  gray100: "#e5e7eb",
  gray300: "#d1d5db",
  gray500: "#6b7280",
  gray700: "#374151",
  green: "#16a34a",
  orange: "#ea580c",
  red: "#dc2626",
  text: "#0a1628",
  textLight: "#6b7280",
};

// ── DATA ───────────────────────────────────────────────────────────────────────
const AIRPORTS = [
  { code:"DJI", city:"Djibouti", flag:"🇩🇯" },
  { code:"CDG", city:"Paris", flag:"🇫🇷" },
  { code:"DXB", city:"Dubai", flag:"🇦🇪" },
  { code:"IST", city:"Istanbul", flag:"🇹🇷" },
  { code:"NBO", city:"Nairobi", flag:"🇰🇪" },
  { code:"ADD", city:"Addis-Abeba", flag:"🇪🇹" },
  { code:"JED", city:"Jeddah", flag:"🇸🇦" },
  { code:"CAI", city:"Le Caire", flag:"🇪🇬" },
  { code:"DOH", city:"Doha", flag:"🇶🇦" },
  { code:"JFK", city:"New York", flag:"🇺🇸" },
  { code:"LHR", city:"Londres", flag:"🇬🇧" },
];

const HOTELS = [
  { id:1, name:"Kempinski Palace Djibouti", city:"Djibouti", stars:5, prix:280, note:4.9, img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", amenities:["Piscine","Spa","Plage privée","WiFi"] },
  { id:2, name:"Sheraton Djibouti", city:"Djibouti", stars:5, prix:210, note:4.6, img:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", amenities:["Piscine","Restaurant","WiFi"] },
  { id:3, name:"Hotel Le Méridien", city:"Djibouti", stars:4, prix:145, note:4.4, img:"https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80", amenities:["Restaurant","WiFi","Bar"] },
  { id:4, name:"Hilton Makkah Convention", city:"La Mecque", stars:5, prix:450, note:4.8, img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", amenities:["Vue Kaaba","Halal","Navette"] },
  { id:5, name:"Pullman Zamzam Makkah", city:"La Mecque", stars:5, prix:380, note:4.7, img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", amenities:["Vue Haram","Halal","WiFi"] },
  { id:6, name:"Anwar Al Madinah", city:"Médine", stars:5, prix:320, note:4.8, img:"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", amenities:["Vue Nabawi","Halal","WiFi"] },
];

const PACKAGES = [
  { id:1, type:"hajj", title:"Hajj Premium 2026", emoji:"🕌", badge:"POPULAIRE", img:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80", prix:4500, duree:"21 jours", places:30, inclus:["Vol A/R DJI→JED","Hôtel 5★ Vue Kaaba","Hôtel 5★ Médine","Transport","Guide FR","Repas","Visa Hajj","Assurance"] },
  { id:2, type:"hajj", title:"Hajj Standard 2026", emoji:"🕌", badge:"", img:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80", prix:3200, duree:"21 jours", places:50, inclus:["Vol A/R","Hôtel 4★","Transport","Guide","Petit-déjeuner","Visa Hajj"] },
  { id:3, type:"omra", title:"Omra Ramadan Premium", emoji:"🌙", badge:"RAMADAN", img:"https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80", prix:2800, duree:"14 jours", places:40, inclus:["Vol A/R","Hôtel 5★","Transport","Guide","Iftar & Suhour","Visa"] },
  { id:4, type:"omra", title:"Omra Économique", emoji:"🌙", badge:"", img:"https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80", prix:1600, duree:"10 jours", places:60, inclus:["Vol A/R","Hôtel 3★","Transport","Visa"] },
  { id:5, type:"voyage", title:"Circuit Maroc Impérial", emoji:"🇲🇦", badge:"NOUVEAU", img:"https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=600&q=80", prix:1800, duree:"10 jours", places:25, inclus:["Vol","Hôtels 4★","Transport privé","Guide FR","Petits-déjeuners"] },
  { id:6, type:"voyage", title:"Safari Kenya", emoji:"🦁", badge:"", img:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80", prix:2200, duree:"8 jours", places:20, inclus:["Vol","Lodge safari","4x4","Guide","Pension complète"] },
];

const RESERVATIONS_DATA = [
  { id:"AT-K8X2P9", client:"Mohamed Ali Hassan", type:"Vol", dest:"DJI→CDG", date:"15/07/2026", prix:840, status:"confirmed", pnr:"ABC123", email:"m.ali@gmail.com", tel:"+253 77 641 234" },
  { id:"AT-L9M3Q1", client:"Fatima Omar Said", type:"Hajj Premium", dest:"DJI→JED", date:"20/06/2026", prix:4500, status:"pending", pnr:null, email:"fatima@gmail.com", tel:"+253 77 523 456" },
  { id:"AT-R5T7W2", client:"Ahmed Ibrahim", type:"Hôtel Kempinski", dest:"Djibouti", date:"10/07/2026", prix:1680, status:"confirmed", pnr:"DEF456", email:"ahmed@gmail.com", tel:"+253 77 789 012" },
  { id:"AT-X1Z4B8", client:"Hodan Abdi", type:"Omra", dest:"DJI→JED", date:"01/08/2026", prix:1600, status:"paid", pnr:"GHI789", email:"hodan@gmail.com", tel:"+253 77 345 678" },
  { id:"AT-N6P2C5", client:"Hassan Yusuf", type:"Circuit Maroc", dest:"DJI→CMN", date:"25/07/2026", prix:3600, status:"pending", pnr:null, email:"hassan@gmail.com", tel:"+253 77 901 234" },
];

const LOYALTY_TIERS = [
  { name:"Bronze", emoji:"🥉", min:0, max:2000, color:"#cd7f32", discount:5 },
  { name:"Silver", emoji:"🥈", min:2000, max:5000, color:"#94a3b8", discount:10 },
  { name:"Gold", emoji:"🥇", min:5000, max:10000, color:C.gold, discount:15 },
  { name:"Platinum", emoji:"💎", min:10000, max:Infinity, color:"#e2e8f0", discount:20 },
];

const LIVE_FLIGHTS = [
  { ref:"AT-K8X2P9", flight:"ET509", airline:"Ethiopian Airlines", from:"DJI", to:"CDG", status:"En vol", progress:65, depart:"08:00", arrivee:"14:30", eta:"14:28" },
  { ref:"AT-X1Z4B8", flight:"TK764", airline:"Turkish Airlines", from:"DJI", to:"IST", status:"À l'heure", progress:20, depart:"23:30", arrivee:"05:15", eta:"05:12" },
];

const BOT_FLOWS = [
  { trigger:"bonjour", reply:"👋 Bienvenue chez Alamin Travels!\n\n1️⃣ Rechercher un vol\n2️⃣ Réserver un hôtel\n3️⃣ Package Hajj/Omra\n4️⃣ Suivre ma réservation\n5️⃣ Parler à un agent" },
  { trigger:"1", reply:"✈️ De quelle ville partez-vous?\nVers quelle destination?" },
  { trigger:"4", reply:"📋 Entrez votre référence (ex: AT-K8X2P9)" },
  { trigger:"AT-K8X2P9", reply:"✅ Réservation AT-K8X2P9\n👤 Mohamed Ali Hassan\n✈️ ET509 DJI→CDG\n📅 15/07/2026\n💰 840$\n🟢 CONFIRMÉ — Bon voyage!" },
  { trigger:"5", reply:"📞 Un agent vous contactera sous 30min.\nTél: +253 77 02 07 07\n📧 reservations@alamintravel-dj.com" },
];

const STATUS = {
  confirmed: { label:"Confirmé", color:C.green, bg:"#f0fdf4", border:"#bbf7d0" },
  pending: { label:"En attente", color:C.orange, bg:"#fff7ed", border:"#fed7aa" },
  paid: { label:"Payé", color:C.blue, bg:"#eff6ff", border:"#bfdbfe" },
  cancelled: { label:"Annulé", color:C.red, bg:"#fef2f2", border:"#fecaca" },
};

const notifyWA = (msg) => window.open(`https://wa.me/25377020707?text=${encodeURIComponent(msg)}`, "_blank");

// ── COMPONENTS ─────────────────────────────────────────────────────────────────
const Badge = ({ children, type="blue" }) => {
  const colors = { blue:`background:${C.blue};color:#fff`, gold:`background:${C.gold};color:#000`, green:`background:${C.green};color:#fff`, orange:`background:${C.orange};color:#fff` };
  return <span style={{ padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:"bold", letterSpacing:0.5, ...Object.fromEntries(colors[type].split(";").map(s=>s.split(":"))) }}>{children}</span>;
};

const Btn = ({ children, onClick, disabled, variant="primary", size="md", fullWidth=false }) => {
  const variants = {
    primary: `background:linear-gradient(135deg,${C.blue},${C.blueDark});color:#fff;border:none`,
    secondary: `background:#fff;color:${C.blue};border:1px solid ${C.blue}`,
    danger: `background:#fff;color:${C.red};border:1px solid ${C.red}`,
    ghost: `background:transparent;color:${C.blue};border:1px solid ${C.gray100}`,
    gold: `background:linear-gradient(135deg,${C.gold},#b8902a);color:#000;border:none`,
  };
  const sizes = { sm:"padding:6px 12px;font-size:12px", md:"padding:10px 20px;font-size:13px", lg:"padding:12px 28px;font-size:14px" };
  const base = `border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;${fullWidth?"width:100%;":""}`;
  const disabledStyle = disabled ? "opacity:0.5;cursor:not-allowed;" : "";
  const styleStr = `${base}${variants[variant]};${sizes[size]};${disabledStyle}`;
  const styleObj = Object.fromEntries(styleStr.split(";").filter(Boolean).map(s => { const [k,...v] = s.split(":"); return [k.trim().replace(/-([a-z])/g, (_,c)=>c.toUpperCase()), v.join(":").trim()]; }));
  return <button onClick={onClick} disabled={disabled} style={styleObj}>{children}</button>;
};

const Input = ({ label, value, onChange, type="text", placeholder="" }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.gray700, marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray300}`, borderRadius:8, fontSize:13, color:C.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#fff" }}
      onFocus={e=>e.target.style.border=`1px solid ${C.blue}`} onBlur={e=>e.target.style.border=`1px solid ${C.gray300}`} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.gray700, marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray300}`, borderRadius:8, fontSize:13, color:C.text, outline:"none", background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
      {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>hover&&setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}
      style={{ background:"#fff", borderRadius:12, border:`1px solid ${isHovered?C.blue:C.gray100}`, boxShadow: isHovered?"0 8px 24px rgba(26,110,181,0.12)":"0 1px 4px rgba(0,0,0,0.06)", transition:"all 0.2s", cursor:onClick?"pointer":"default", overflow:"hidden", ...style }}>
      {children}
    </div>
  );
};

const StarRating = ({ note }) => (
  <span style={{ color:C.gold, fontSize:11 }}>{"★".repeat(Math.floor(note))}{"☆".repeat(5-Math.floor(note))} <span style={{ color:C.gray500, fontSize:11 }}>{note}</span></span>
);

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function AlaminTravels() {
  const [page, setPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);

  // Search
  const [search, setSearch] = useState({ origin:"DJI", destination:"CDG", date:"", adults:"1", class:"ECONOMY", type:"oneway" });
  const [flights, setFlights] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Filters
  const [hotelFilter, setHotelFilter] = useState("Tous");
  const [pkgFilter, setPkgFilter] = useState("Tous");

  // Booking
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookStep, setBookStep] = useState(0);
  const [nights, setNights] = useState(3);
  const [form, setForm] = useState({ prenom:"", nom:"", email:"", tel:"", passport:"", dob:"", paiement:"agence" });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Admin
  const [reservations, setReservations] = useState(RESERVATIONS_DATA);
  const [selectedRes, setSelectedRes] = useState(null);
  const [pnrInput, setPnrInput] = useState("");
  const [showPNRModal, setShowPNRModal] = useState(false);
  const [adminFilter, setAdminFilter] = useState("Tous");

  // Chat IA
  const [messages, setMessages] = useState([{ role:"assistant", content:"Bonjour ! Je suis votre conseiller voyage Alamin Travels. Comment puis-je vous aider aujourd'hui ? ✈️" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // WhatsApp Bot
  const [botMessages, setBotMessages] = useState([{ from:"bot", text:"👋 Bienvenue chez Alamin Travels!\n\n1️⃣ Rechercher un vol\n2️⃣ Réserver un hôtel\n3️⃣ Package Hajj/Omra\n4️⃣ Suivre ma réservation\n5️⃣ Parler à un agent" }]);
  const [botInput, setBotInput] = useState("");

  // Loyalty
  const clientPoints = 3850;
  const clientTier = LOYALTY_TIERS.find(t => clientPoints >= t.min && clientPoints < t.max);
  const nextTier = LOYALTY_TIERS[LOYALTY_TIERS.indexOf(clientTier)+1];
  const loyaltyPct = nextTier ? ((clientPoints-clientTier.min)/(nextTier.min-clientTier.min))*100 : 100;

  // Tracker
  const [trackedFlight, setTrackedFlight] = useState(LIVE_FLIGHTS[0]);
  const [trackProgress, setTrackProgress] = useState(0);
  useEffect(() => { setTimeout(()=>setTrackProgress(trackedFlight.progress), 600); }, [trackedFlight]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  // Mock flight search
  const searchFlights = async () => {
    if (!search.date) return;
    setSearchLoading(true); setFlights([]);
    await new Promise(r=>setTimeout(r,1500));
    setFlights([
      { id:1, logo:"🇪🇹", airline:"Ethiopian Airlines", code:"ET509", dep:search.origin, arr:search.destination, depTime:"08:00", arrTime:"14:30", stops:"Direct", duration:"6h30", price:Math.round(350+Math.random()*200) },
      { id:2, logo:"🇹🇷", airline:"Turkish Airlines", code:"TK764", dep:search.origin, arr:search.destination, depTime:"23:30", arrTime:"13:45+1", stops:"1 escale", duration:"14h15", price:Math.round(280+Math.random()*150) },
      { id:3, logo:"🇦🇪", airline:"Emirates", code:"EK723", dep:search.origin, arr:search.destination, depTime:"14:00", arrTime:"20:30", stops:"1 escale", duration:"6h30", price:Math.round(420+Math.random()*300) },
      { id:4, logo:"🇫🇷", airline:"Air France", code:"AF490", dep:search.origin, arr:search.destination, depTime:"11:45", arrTime:"20:15", stops:"1 escale", duration:"8h30", price:Math.round(400+Math.random()*200) },
    ].sort((a,b)=>a.price-b.price));
    setSearchLoading(false);
  };

  // AI Chat
  const sendChat = async (text) => {
    const t = text||chatInput.trim();
    if (!t||chatLoading) return;
    setChatInput("");
    const hist = [...messages, {role:"user",content:t}];
    setMessages(hist);
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
          system:`Tu es le conseiller voyage d'Alamin Travels, agence IATA à Djibouti. Réponds en français, de façon professionnelle et concise (max 200 mots). Spécialiste: vols depuis Djibouti, Hajj/Omra, tourisme Afrique. Contact: +253 77 02 07 07, reservations@alamintravel-dj.com`,
          messages:hist.map(m=>({role:m.role,content:m.content})) })
      });
      const d = await res.json();
      setMessages([...hist, {role:"assistant",content:d.content?.[0]?.text||"Désolé, une erreur est survenue."}]);
    } catch { setMessages([...hist, {role:"assistant",content:"⚠️ Erreur de connexion. Veuillez réessayer."}]); }
    setChatLoading(false);
  };

  // WhatsApp Bot
  const sendBot = (t) => {
    const msg = t||botInput.trim();
    if (!msg) return;
    setBotInput("");
    const flow = BOT_FLOWS.find(f=>msg.toLowerCase().includes(f.trigger.toLowerCase()));
    setBotMessages(prev=>[...prev, {from:"user",text:msg}, {from:"bot",text:flow?.reply||"Un agent vous contactera.\n📞 +253 77 02 07 07"}]);
  };

  // Booking
  const confirmBooking = () => {
    const ref = "AT-"+Math.random().toString(36).substr(2,8).toUpperCase();
    const bk = { ref, ...form, type:selectedFlight?"Vol":selectedHotel?"Hôtel":"Package" };
    setConfirmedBooking(bk);
    setBookStep(3);
    notifyWA(`🎉 NOUVELLE RÉSERVATION\nRef: ${ref}\nClient: ${form.prenom} ${form.nom}\nEmail: ${form.email}\nTél: ${form.tel}\nType: ${bk.type}\nPaiement: ${form.paiement==="agence"?"Agence":"Plus tard"}`);
  };

  // Admin
  const updateRes = (id, status, pnr) => {
    setReservations(prev=>prev.map(r=>r.id===id?{...r,status,...(pnr&&{pnr})}:r));
    setSelectedRes(null); setShowPNRModal(false); setPnrInput("");
    const r = reservations.find(r=>r.id===id);
    if(r) notifyWA(`✅ MAJ ${id}\nClient: ${r.client}\nStatut: ${STATUS[status]?.label}${pnr?`\nPNR: ${pnr}`:""}`);
  };

  const navTo = (p) => { setPage(p); setMobileMenu(false); setBookStep(0); setSelectedFlight(null); setSelectedHotel(null); setSelectedPackage(null); setConfirmedBooking(null); };

  const NAV_ITEMS = [["home","🏠","Accueil"],["vols","✈️","Vols"],["hotels","🏨","Hôtels"],["packages","🕌","Packages"],["agent","💬","Agent IA"],["tracker","📍","Tracker"],["loyalty","⭐","Fidélité"],["whatsapp","📱","WhatsApp"],["admin","⚙️","Admin"]];

  const renderBooking = () => {
    const item = selectedFlight||selectedHotel||selectedPackage;
    const total = selectedFlight?selectedFlight.price*parseInt(search.adults):selectedHotel?selectedHotel.prix*nights:selectedPackage?selectedPackage.prix:0;
    if (bookStep===3&&confirmedBooking) return (
      <div style={{ maxWidth:560, margin:"40px auto", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px", boxShadow:`0 8px 24px rgba(26,110,181,0.3)` }}>✓</div>
        <h2 style={{ fontSize:26, color:C.navy, marginBottom:6 }}>Réservation Confirmée !</h2>
        <div style={{ fontSize:20, fontWeight:"bold", color:C.blue, letterSpacing:3, marginBottom:20 }}>{confirmedBooking.ref}</div>
        <Card style={{ padding:"20px", marginBottom:20, textAlign:"left" }}>
          <div style={{ fontWeight:"bold", color:C.navy, marginBottom:12, fontSize:13, textTransform:"uppercase", letterSpacing:0.5 }}>Récapitulatif</div>
          {[["Type",confirmedBooking.type],["Client",`${confirmedBooking.prenom} ${confirmedBooking.nom}`],["Email",confirmedBooking.email],["Téléphone",confirmedBooking.tel],["Paiement",confirmedBooking.paiement==="agence"?"Payer à l'agence":"Payer plus tard"]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.gray100}`, fontSize:13 }}>
              <span style={{ color:C.gray500 }}>{l}</span><span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </Card>
        <div style={{ padding:"14px", borderRadius:8, background:"#f0fdf4", border:`1px solid #bbf7d0`, fontSize:12, color:"#166534", marginBottom:20, lineHeight:1.8 }}>
          ✅ Notification envoyée au +253 77 02 07 07<br/>
          📧 Confirmation à {confirmedBooking.email}<br/>
          📍 Salines Ouest, Mohamed Kamil Road, Djibouti
        </div>
        <Btn onClick={()=>{setBookStep(0);setSelectedFlight(null);setSelectedHotel(null);setSelectedPackage(null);setConfirmedBooking(null);setForm({prenom:"",nom:"",email:"",tel:"",passport:"",dob:"",paiement:"agence"});}}>Nouvelle Réservation →</Btn>
      </div>
    );
    if (bookStep===2) return (
      <div style={{ maxWidth:560, margin:"40px auto" }}>
        <h2 style={{ fontSize:22, color:C.navy, marginBottom:20 }}>Informations Voyageur</h2>
        <Card style={{ padding:24 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Prénom *" value={form.prenom} onChange={v=>setForm(p=>({...p,prenom:v}))} />
            <Input label="Nom *" value={form.nom} onChange={v=>setForm(p=>({...p,nom:v}))} />
            <Input label="Email *" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} type="email" />
            <Input label="Téléphone *" value={form.tel} onChange={v=>setForm(p=>({...p,tel:v}))} type="tel" />
            <Input label="N° Passeport" value={form.passport} onChange={v=>setForm(p=>({...p,passport:v}))} />
            <Input label="Date de naissance" value={form.dob} onChange={v=>setForm(p=>({...p,dob:v}))} type="date" />
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.gray700, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Mode de paiement</div>
            {[["agence","🏢 Payer à l'agence","Salines Ouest, Mohamed Kamil Road, Djibouti"],["later","⏰ Payer plus tard","Réservation maintenue 48 heures"]].map(([v,l,sub])=>(
              <div key={v} onClick={()=>setForm(p=>({...p,paiement:v}))} style={{ padding:"12px 14px", borderRadius:8, border:`2px solid ${form.paiement===v?C.blue:C.gray100}`, background:form.paiement===v?"#eff6ff":"#fff", cursor:"pointer", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${form.paiement===v?C.blue:C.gray300}`, background:form.paiement===v?C.blue:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>{form.paiement===v?"✓":""}</div>
                <div><div style={{ fontWeight:600, fontSize:13 }}>{l}</div><div style={{ fontSize:11, color:C.gray500 }}>{sub}</div></div>
              </div>
            ))}
          </div>
          <div style={{ padding:"12px 16px", borderRadius:8, background:C.gray50, border:`1px solid ${C.gray100}`, display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <span style={{ fontWeight:600 }}>Total à payer</span><span style={{ fontSize:20, fontWeight:"bold", color:C.blue }}>{total}$</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={()=>setBookStep(1)}>← Retour</Btn>
            <Btn onClick={confirmBooking} disabled={!form.prenom||!form.email} fullWidth>✅ Confirmer la réservation</Btn>
          </div>
        </Card>
      </div>
    );
    return (
      <div style={{ maxWidth:560, margin:"40px auto" }}>
        <h2 style={{ fontSize:22, color:C.navy, marginBottom:20 }}>Récapitulatif</h2>
        <Card style={{ padding:20, marginBottom:16 }}>
          {selectedFlight && <>
            <div style={{ display:"flex", gap:12, marginBottom:12, alignItems:"center" }}>
              <span style={{ fontSize:32 }}>{selectedFlight.logo}</span>
              <div>
                <div style={{ fontWeight:"bold", fontSize:16 }}>{selectedFlight.airline}</div>
                <div style={{ color:C.gray500, fontSize:13 }}>{selectedFlight.code} · {selectedFlight.stops} · {selectedFlight.duration}</div>
              </div>
            </div>
            <div style={{ padding:"10px 14px", background:C.gray50, borderRadius:8, fontSize:14, fontWeight:600, marginBottom:8 }}>
              {selectedFlight.depTime} <span style={{ color:C.blue }}>→</span> {selectedFlight.arrTime} &nbsp;·&nbsp; {selectedFlight.dep} → {selectedFlight.arr}
            </div>
          </>}
          {selectedHotel && <>
            <img src={selectedHotel.img} alt={selectedHotel.name} style={{ width:"100%", height:140, objectFit:"cover", borderRadius:8, marginBottom:12 }} />
            <div style={{ fontWeight:"bold", fontSize:16, marginBottom:4 }}>{selectedHotel.name}</div>
            <div style={{ color:C.gray500, fontSize:13, marginBottom:12 }}>{selectedHotel.city} · {"⭐".repeat(selectedHotel.stars)}</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:13 }}>Nuits :</span>
              <button onClick={()=>setNights(n=>Math.max(1,n-1))} style={{ width:28,height:28,borderRadius:"50%",border:`1px solid ${C.gray300}`,background:"#fff",cursor:"pointer",fontSize:14 }}>−</button>
              <span style={{ fontSize:16,fontWeight:"bold",color:C.blue,minWidth:20,textAlign:"center" }}>{nights}</span>
              <button onClick={()=>setNights(n=>n+1)} style={{ width:28,height:28,borderRadius:"50%",border:`1px solid ${C.gray300}`,background:"#fff",cursor:"pointer",fontSize:14 }}>+</button>
            </div>
          </>}
          {selectedPackage && <>
            <img src={selectedPackage.img} alt={selectedPackage.title} style={{ width:"100%", height:140, objectFit:"cover", borderRadius:8, marginBottom:12 }} />
            <div style={{ fontWeight:"bold", fontSize:16, marginBottom:4 }}>{selectedPackage.emoji} {selectedPackage.title}</div>
            <div style={{ color:C.gray500, fontSize:13, marginBottom:8 }}>{selectedPackage.duree} · {selectedPackage.places} places disponibles</div>
            {selectedPackage.inclus.slice(0,4).map(i=><div key={i} style={{ fontSize:12, color:C.gray700, marginBottom:2 }}>✓ {i}</div>)}
          </>}
          <div style={{ borderTop:`1px solid ${C.gray100}`, marginTop:12, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:600 }}>Total</span>
            <span style={{ fontSize:22, fontWeight:"bold", color:C.blue }}>{total}$</span>
          </div>
        </Card>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={()=>setBookStep(0)}>← Retour</Btn>
          <Btn onClick={()=>setBookStep(2)} fullWidth>Continuer →</Btn>
        </div>
      </div>
    );
  };

  const fmt = (t) => t.split("\n").map((l,i,a)=><span key={i}><span dangerouslySetInnerHTML={{__html:l.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}} />{i<a.length-1&&<br/>}</span>);

  return (
    <div style={{ minHeight:"100vh", background:C.offWhite, fontFamily:"'Segoe UI','Helvetica Neue',Arial,sans-serif", color:C.text }}>

      {/* ── HEADER ── */}
      <header style={{ background:C.navy, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        {/* Top bar */}
        <div style={{ background:C.navyDark, padding:"4px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>📍 Salines Ouest, Djibouti &nbsp;|&nbsp; ✉️ reservations@alamintravel-dj.com</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>📞 +253 21 25 07 17 &nbsp;|&nbsp; 📱 +253 77 64 64 05</div>
        </div>
        {/* Main nav */}
        <div style={{ padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={()=>navTo("home")}>
            <div style={{ width:38, height:38, background:`linear-gradient(135deg,${C.gold},#b8902a)`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:"bold", color:C.navy }}>✈</div>
            <div>
              <div style={{ fontSize:16, fontWeight:"bold", color:"#fff", letterSpacing:1, lineHeight:1 }}>Alamin Travels</div>
              <div style={{ fontSize:9, color:C.gold, letterSpacing:2 }}>IATA ACCREDITED · DJIBOUTI</div>
            </div>
          </div>
          {/* Desktop nav */}
          <nav style={{ display:"flex", gap:2 }}>
            {NAV_ITEMS.slice(1,-1).map(([tab,icon,label])=>(
              <button key={tab} onClick={()=>navTo(tab)} style={{ padding:"8px 12px", background:page===tab?`rgba(26,110,181,0.3)`:"transparent", border:"none", borderRadius:6, color:page===tab?"#fff":"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, transition:"all 0.2s" }}>
                <span style={{fontSize:14}}>{icon}</span><span>{label}</span>
              </button>
            ))}
            <button onClick={()=>navTo("admin")} style={{ padding:"8px 12px", background:page==="admin"?`rgba(26,110,181,0.3)`:"transparent", border:"none", borderRadius:6, color:page==="admin"?"#fff":"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>
              <span>⚙️</span><span>Admin</span>
            </button>
          </nav>
          <button onClick={()=>navTo("vols")} style={{ padding:"9px 20px", background:`linear-gradient(135deg,${C.gold},#b8902a)`, border:"none", borderRadius:8, color:C.navy, fontWeight:"bold", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            Réserver maintenant →
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"24px 20px" }}>

        {/* ── HOME ── */}
        {page==="home" && (
          <div>
            {/* Hero */}
            <div style={{ borderRadius:16, overflow:"hidden", position:"relative", height:400, marginBottom:28 }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80)", backgroundSize:"cover", backgroundPosition:"center" }} />
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, rgba(10,22,40,0.85) 0%, rgba(26,110,181,0.5) 100%)` }} />
              <div style={{ position:"relative", padding:"60px 48px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(212,175,55,0.2)", border:"1px solid rgba(212,175,55,0.4)", borderRadius:20, padding:"4px 12px", marginBottom:16, width:"fit-content" }}>
                  <span style={{ color:C.gold, fontSize:12 }}>✦</span>
                  <span style={{ color:C.gold, fontSize:11, letterSpacing:2, fontWeight:600 }}>IATA ACCREDITED AGENT</span>
                </div>
                <h1 style={{ fontSize:40, fontWeight:"bold", color:"#fff", margin:"0 0 12px", lineHeight:1.2, textShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>Votre Agence de Voyage<br/><span style={{ color:C.gold }}>à Djibouti</span></h1>
                <p style={{ color:"rgba(255,255,255,0.8)", fontSize:16, marginBottom:28, maxWidth:500 }}>Vols, Hôtels, Hajj & Omra — Service professionnel depuis 2010</p>
                <div style={{ display:"flex", gap:12 }}>
                  <button onClick={()=>navTo("vols")} style={{ padding:"13px 28px", background:`linear-gradient(135deg,${C.gold},#b8902a)`, border:"none", borderRadius:8, color:C.navy, fontWeight:"bold", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>✈️ Rechercher un vol</button>
                  <button onClick={()=>navTo("packages")} style={{ padding:"13px 28px", background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:8, color:"#fff", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>🕌 Hajj & Omra</button>
                </div>
              </div>
            </div>

            {/* Quick search bar */}
            <Card style={{ padding:20, marginBottom:24 }}>
              <div style={{ fontSize:14, fontWeight:"bold", color:C.navy, marginBottom:14 }}>🔍 Recherche rapide</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10, alignItems:"end" }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginBottom:4 }}>DÉPART</div>
                  <select value={search.origin} onChange={e=>setSearch(p=>({...p,origin:e.target.value}))} style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray300}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit" }}>
                    {AIRPORTS.map(a=><option key={a.code} value={a.code}>{a.flag} {a.city}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginBottom:4 }}>DESTINATION</div>
                  <select value={search.destination} onChange={e=>setSearch(p=>({...p,destination:e.target.value}))} style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray300}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit" }}>
                    {AIRPORTS.map(a=><option key={a.code} value={a.code}>{a.flag} {a.city}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginBottom:4 }}>DATE</div>
                  <input type="date" value={search.date} onChange={e=>setSearch(p=>({...p,date:e.target.value}))} style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray300}`, borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box" }} />
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginBottom:4 }}>VOYAGEURS</div>
                  <select value={search.adults} onChange={e=>setSearch(p=>({...p,adults:e.target.value}))} style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray300}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit" }}>
                    {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} adulte{n>1?"s":""}</option>)}
                  </select>
                </div>
                <button onClick={()=>{searchFlights();navTo("vols");}} disabled={!search.date} style={{ padding:"9px 20px", background:search.date?`linear-gradient(135deg,${C.blue},${C.blueDark})`:"#ccc", border:"none", borderRadius:8, color:"#fff", fontWeight:"bold", cursor:search.date?"pointer":"not-allowed", fontSize:13, fontFamily:"inherit", whiteSpace:"nowrap" }}>
                  🔍 Rechercher
                </button>
              </div>
            </Card>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              {[["500+","Clients satisfaits","👥"],["15+","Destinations","🌍"],["24/7","Support IA","🤖"],["IATA","Accrédité","✈️"]].map(([v,l,icon])=>(
                <Card key={l} style={{ padding:"20px", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontSize:24, fontWeight:"bold", color:C.blue, marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:12, color:C.gray500 }}>{l}</div>
                </Card>
              ))}
            </div>

            {/* Services */}
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:20, fontWeight:"bold", color:C.navy, marginBottom:16 }}>Nos Services</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
                {[["✈️","Vols","Amadeus temps réel","vols",C.blue],["🏨","Hôtels","Djibouti & Monde","hotels","#0891b2"],["🕌","Hajj & Omra","Packages complets","packages",C.gold],["💬","Agent IA","Conseiller 24h/24","agent","#7c3aed"],["📍","Tracker","Suivi vols live","tracker",C.green],["⭐","Fidélité","Points & Avantages","loyalty",C.orange]].map(([icon,title,sub,tab,color])=>(
                  <Card key={tab} hover onClick={()=>navTo(tab)} style={{ padding:20, textAlign:"center", cursor:"pointer" }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 10px" }}>{icon}</div>
                    <div style={{ fontWeight:"bold", fontSize:14, color:C.navy, marginBottom:4 }}>{title}</div>
                    <div style={{ fontSize:11, color:C.gray500 }}>{sub}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured packages */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h2 style={{ fontSize:20, fontWeight:"bold", color:C.navy, margin:0 }}>🕌 Packages Phares</h2>
                <button onClick={()=>navTo("packages")} style={{ color:C.blue, background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600 }}>Voir tout →</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {PACKAGES.slice(0,3).map(p=>(
                  <Card key={p.id} hover style={{ overflow:"hidden" }}>
                    <div style={{ position:"relative", height:150 }}>
                      <img src={p.img} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)" }} />
                      {p.badge && <div style={{ position:"absolute", top:10, left:10, padding:"3px 8px", background:C.gold, borderRadius:4, fontSize:10, fontWeight:"bold", color:C.navy }}>{p.badge}</div>}
                      <div style={{ position:"absolute", bottom:10, left:12, fontSize:22 }}>{p.emoji}</div>
                    </div>
                    <div style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <div style={{ fontWeight:"bold", fontSize:14 }}>{p.title}</div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:18, fontWeight:"bold", color:C.blue }}>{p.prix}$</div>
                          <div style={{ fontSize:10, color:C.gray500 }}>/personne</div>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:C.gray500, marginBottom:10 }}>{p.duree} · {p.places} places</div>
                      <button onClick={()=>{setSelectedPackage(p);setBookStep(1);navTo("packages");}} style={{ width:"100%", padding:"8px", background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, border:"none", borderRadius:8, color:"#fff", fontWeight:"bold", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Réserver →</button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VOLS ── */}
        {page==="vols" && bookStep===0 && (
          <div>
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, marginBottom:4 }}>✈️ Recherche de Vols</h1>
              <p style={{ color:C.gray500, fontSize:14 }}>Trouvez les meilleurs vols depuis Djibouti</p>
            </div>
            <Card style={{ padding:24, marginBottom:24 }}>
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {[["oneway","Aller simple"],["roundtrip","Aller-retour"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setSearch(p=>({...p,type:v}))} style={{ padding:"7px 16px", borderRadius:20, border:`1px solid ${search.type===v?C.blue:C.gray300}`, background:search.type===v?"#eff6ff":"#fff", color:search.type===v?C.blue:C.gray700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>{l}</button>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:14 }}>
                <Select label="Départ" value={search.origin} onChange={v=>setSearch(p=>({...p,origin:v}))} options={AIRPORTS.map(a=>[a.code,`${a.flag} ${a.city} (${a.code})`])} />
                <Select label="Destination" value={search.destination} onChange={v=>setSearch(p=>({...p,destination:v}))} options={AIRPORTS.map(a=>[a.code,`${a.flag} ${a.city} (${a.code})`])} />
                <Input label="Date départ *" value={search.date} onChange={v=>setSearch(p=>({...p,date:v}))} type="date" />
                <Select label="Voyageurs" value={search.adults} onChange={v=>setSearch(p=>({...p,adults:v}))} options={[1,2,3,4,5,6].map(n=>[n,`${n} adulte${n>1?"s":""}`])} />
              </div>
              <Select label="Classe" value={search.class} onChange={v=>setSearch(p=>({...p,class:v}))} options={[["ECONOMY","Économique"],["PREMIUM_ECONOMY","Premium Économique"],["BUSINESS","Business"],["FIRST","Première classe"]]} />
              <Btn onClick={searchFlights} disabled={searchLoading||!search.date} fullWidth size="lg">
                {searchLoading?"⏳ Recherche en cours...":"🔍 Rechercher des vols"}
              </Btn>
            </Card>
            {flights.length>0 && (
              <div>
                <div style={{ fontSize:13, color:C.gray500, marginBottom:12 }}>{flights.length} vol{flights.length>1?"s":""} trouvé{flights.length>1?"s":""} · {search.origin} → {search.destination}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {flights.map(f=>(
                    <Card key={f.id} hover onClick={()=>{setSelectedFlight(f);setBookStep(1);}} style={{ padding:"16px 20px", cursor:"pointer" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                          <span style={{ fontSize:32 }}>{f.logo}</span>
                          <div>
                            <div style={{ fontWeight:"bold", fontSize:15 }}>{f.airline}</div>
                            <div style={{ color:C.gray500, fontSize:12 }}>{f.code} · {f.stops} · {f.duration}</div>
                          </div>
                        </div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:18, fontWeight:"bold" }}>{f.depTime} <span style={{ color:C.blue }}>→</span> {f.arrTime}</div>
                          <div style={{ color:C.gray500, fontSize:12 }}>{f.dep} → {f.arr}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:28, fontWeight:"bold", color:C.blue }}>{f.price}$</div>
                          <div style={{ fontSize:11, color:C.gray500 }}>/ personne</div>
                          <div style={{ marginTop:6 }}><Btn size="sm">Sélectionner →</Btn></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {page==="vols" && bookStep>0 && renderBooking()}

        {/* ── HOTELS ── */}
        {page==="hotels" && bookStep===0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, margin:0 }}>🏨 Hôtels</h1>
                <p style={{ color:C.gray500, fontSize:14, margin:"4px 0 0" }}>Djibouti, La Mecque & Médine</p>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {["Tous","Djibouti","La Mecque","Médine"].map(f=>(
                  <button key={f} onClick={()=>setHotelFilter(f)} style={{ padding:"7px 14px", borderRadius:20, border:`1px solid ${hotelFilter===f?C.blue:C.gray300}`, background:hotelFilter===f?"#eff6ff":"#fff", color:hotelFilter===f?C.blue:C.gray700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
              {HOTELS.filter(h=>hotelFilter==="Tous"||h.city===hotelFilter).map(h=>(
                <Card key={h.id} hover style={{ overflow:"hidden" }}>
                  <div style={{ position:"relative", height:180 }}>
                    <img src={h.img} alt={h.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
                    <div style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.95)", borderRadius:6, padding:"4px 8px", fontSize:11, fontWeight:"bold", color:C.navy }}>{h.city}</div>
                  </div>
                  <div style={{ padding:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontWeight:"bold", fontSize:15 }}>{h.name}</div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:20, fontWeight:"bold", color:C.blue }}>{h.prix}$</div>
                        <div style={{ fontSize:10, color:C.gray500 }}>/nuit</div>
                      </div>
                    </div>
                    <div style={{ marginBottom:8 }}><StarRating note={h.note} /></div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
                      {h.amenities.map(a=><span key={a} style={{ padding:"2px 8px", background:C.gray50, border:`1px solid ${C.gray100}`, borderRadius:4, fontSize:10, color:C.gray700 }}>{a}</span>)}
                    </div>
                    <Btn onClick={()=>{setSelectedHotel(h);setBookStep(1);}} fullWidth>Réserver →</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {page==="hotels" && bookStep>0 && renderBooking()}

        {/* ── PACKAGES ── */}
        {page==="packages" && bookStep===0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, margin:0 }}>🕌 Hajj, Omra & Voyages</h1>
                <p style={{ color:C.gray500, fontSize:14, margin:"4px 0 0" }}>Packages tout inclus depuis Djibouti</p>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {[["Tous","Tous"],["hajj","🕌 Hajj"],["omra","🌙 Omra"],["voyage","✈️ Voyages"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setPkgFilter(v)} style={{ padding:"7px 14px", borderRadius:20, border:`1px solid ${pkgFilter===v?C.blue:C.gray300}`, background:pkgFilter===v?"#eff6ff":"#fff", color:pkgFilter===v?C.blue:C.gray700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
              {PACKAGES.filter(p=>pkgFilter==="Tous"||p.type===pkgFilter).map(p=>(
                <Card key={p.id} hover style={{ overflow:"hidden" }}>
                  <div style={{ position:"relative", height:180 }}>
                    <img src={p.img} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)" }} />
                    {p.badge && <div style={{ position:"absolute", top:10, left:10, padding:"3px 8px", background:C.gold, borderRadius:4, fontSize:10, fontWeight:"bold", color:C.navy }}>{p.badge}</div>}
                    <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,0.6)", borderRadius:4, padding:"3px 8px", fontSize:11, color:"#fff" }}>{p.duree}</div>
                    <div style={{ position:"absolute", bottom:10, left:12, fontSize:24 }}>{p.emoji}</div>
                  </div>
                  <div style={{ padding:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ fontWeight:"bold", fontSize:15 }}>{p.title}</div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:20, fontWeight:"bold", color:C.blue }}>{p.prix}$</div>
                        <div style={{ fontSize:10, color:C.gray500 }}>/personne</div>
                      </div>
                    </div>
                    <div style={{ marginBottom:10 }}>
                      {p.inclus.slice(0,3).map(i=><div key={i} style={{ fontSize:12, color:C.gray600, marginBottom:2 }}>✓ {i}</div>)}
                      {p.inclus.length>3 && <div style={{ fontSize:12, color:C.blue }}>+{p.inclus.length-3} services inclus</div>}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:11, color:C.gray500 }}>👥 {p.places} places dispo</span>
                      <Btn size="sm" onClick={()=>{setSelectedPackage(p);setBookStep(1);}}>Réserver →</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {page==="packages" && bookStep>0 && renderBooking()}

        {/* ── AGENT IA ── */}
        {page==="agent" && (
          <div style={{ maxWidth:720, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 10px", boxShadow:`0 8px 24px rgba(26,110,181,0.3)` }}>✦</div>
              <h1 style={{ fontSize:22, fontWeight:"bold", color:C.navy, margin:"0 0 4px" }}>Agent IA Alamin Travels</h1>
              <p style={{ color:C.gray500, fontSize:13 }}>Conseiller voyage disponible 24h/24 · 7j/7</p>
            </div>
            <Card style={{ display:"flex", flexDirection:"column", height:500 }}>
              {/* Messages */}
              <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:14 }}>
                {messages.map((m,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-start" }}>
                    {m.role==="assistant" && <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginTop:2,color:"#fff" }}>✦</div>}
                    <div style={{ maxWidth:"72%", padding:"11px 14px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px", background:m.role==="user"?`linear-gradient(135deg,${C.blue},${C.blueDark})`:"#f8f9fb", border:m.role==="user"?"none":`1px solid ${C.gray100}`, color:m.role==="user"?"#fff":C.text, fontSize:13, lineHeight:1.7 }}>
                      {fmt(m.content)}
                    </div>
                  </div>
                ))}
                {chatLoading && <div style={{ display:"flex", gap:10 }}>
                  <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff" }}>✦</div>
                  <div style={{ padding:"11px 16px",background:C.gray50,border:`1px solid ${C.gray100}`,borderRadius:"4px 16px 16px 16px",display:"flex",gap:4,alignItems:"center" }}>
                    {[0,1,2].map(d=><div key={d} style={{ width:6,height:6,borderRadius:"50%",background:C.blue,animation:`pulse 1.2s ease-in-out ${d*0.2}s infinite` }}/>)}
                  </div>
                </div>}
                <div ref={chatEndRef}/>
              </div>
              {/* Quick replies */}
              <div style={{ padding:"10px 20px", borderTop:`1px solid ${C.gray100}`, display:"flex", gap:8, flexWrap:"wrap" }}>
                {["✈️ Vol Djibouti-Paris","🕌 Package Hajj 2026","🏨 Hôtel 5★ Mecque","🦈 Requins baleines"].map(s=>(
                  <button key={s} onClick={()=>sendChat(s)} style={{ padding:"5px 12px", background:C.gray50, border:`1px solid ${C.gray100}`, borderRadius:16, color:C.blue, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>{s}</button>
                ))}
              </div>
              {/* Input */}
              <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.gray100}`, display:"flex", gap:8 }}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder="Posez votre question..." style={{ flex:1, padding:"10px 14px", border:`1px solid ${C.gray300}`, borderRadius:24, fontSize:13, outline:"none", fontFamily:"inherit" }}
                  onFocus={e=>e.target.style.border=`1px solid ${C.blue}`} onBlur={e=>e.target.style.border=`1px solid ${C.gray300}`} />
                <button onClick={()=>sendChat()} disabled={chatLoading||!chatInput.trim()} style={{ width:40,height:40,borderRadius:"50%",background:chatInput.trim()&&!chatLoading?`linear-gradient(135deg,${C.blue},${C.blueDark})`:"#e5e7eb",border:"none",cursor:chatInput.trim()&&!chatLoading?"pointer":"not-allowed",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>➤</button>
              </div>
            </Card>
          </div>
        )}

        {/* ── TRACKER ── */}
        {page==="tracker" && (
          <div style={{ maxWidth:800, margin:"0 auto" }}>
            <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, marginBottom:4 }}>📍 Suivi de Vols en Direct</h1>
            <p style={{ color:C.gray500, fontSize:14, marginBottom:20 }}>Suivez vos vols en temps réel</p>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {LIVE_FLIGHTS.map(f=>(
                <button key={f.ref} onClick={()=>{setTrackedFlight(f);setTrackProgress(0);setTimeout(()=>setTrackProgress(f.progress),300);}} style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${trackedFlight.ref===f.ref?C.blue:C.gray300}`, background:trackedFlight.ref===f.ref?"#eff6ff":"#fff", color:trackedFlight.ref===f.ref?C.blue:C.gray700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>✈️ {f.flight} ({f.ref})</button>
              ))}
            </div>
            <Card style={{ padding:24, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:"bold", marginBottom:4 }}>✈️ {trackedFlight.flight}</div>
                  <div style={{ color:C.gray500, fontSize:14 }}>{trackedFlight.airline}</div>
                  <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Réf: {trackedFlight.ref}</div>
                </div>
                <div style={{ padding:"8px 16px", borderRadius:20, background:trackedFlight.status==="En vol"?"#f0fdf4":"#fff7ed", border:`1px solid ${trackedFlight.status==="En vol"?"#bbf7d0":"#fed7aa"}`, color:trackedFlight.status==="En vol"?C.green:C.orange, fontWeight:"bold", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                  {trackedFlight.status==="En vol"?"🟢":"🟡"} {trackedFlight.status}
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28, fontWeight:"bold", color:C.navy }}>{trackedFlight.from}</div>
                  <div style={{ fontSize:12, color:C.gray500 }}>Départ {trackedFlight.depart}</div>
                </div>
                <div style={{ flex:1, margin:"0 20px", position:"relative" }}>
                  <div style={{ height:6, background:C.gray100, borderRadius:3 }}>
                    <div style={{ height:"100%", background:`linear-gradient(90deg,${C.blue},${C.blueLight})`, borderRadius:3, width:`${trackProgress}%`, transition:"width 1.5s ease" }}/>
                    <div style={{ position:"absolute", top:"50%", left:`${trackProgress}%`, transform:"translate(-50%,-50%)", fontSize:20, transition:"left 1.5s ease" }}>✈️</div>
                  </div>
                  <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:C.gray500 }}>{trackProgress}% du trajet · ETA {trackedFlight.eta}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28, fontWeight:"bold", color:C.navy }}>{trackedFlight.to}</div>
                  <div style={{ fontSize:12, color:C.gray500 }}>Arrivée {trackedFlight.arrivee}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {[["Réf",trackedFlight.ref,"📋"],["Départ",trackedFlight.depart,"🛫"],["Arrivée",trackedFlight.arrivee,"🛬"],["ETA",trackedFlight.eta,"⏰"]].map(([l,v,icon])=>(
                  <div key={l} style={{ padding:"12px", borderRadius:8, background:C.gray50, textAlign:"center" }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{icon}</div>
                    <div style={{ fontSize:14, fontWeight:"bold", color:C.navy }}>{v}</div>
                    <div style={{ fontSize:10, color:C.gray500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── LOYALTY ── */}
        {page==="loyalty" && (
          <div style={{ maxWidth:800, margin:"0 auto" }}>
            <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, marginBottom:4 }}>⭐ Programme de Fidélité</h1>
            <p style={{ color:C.gray500, fontSize:14, marginBottom:20 }}>Gagnez des points à chaque voyage</p>
            {/* Member card */}
            <div style={{ borderRadius:16, background:`linear-gradient(135deg,${C.navy},${C.navyLight},${C.blue})`, padding:"28px 32px", marginBottom:24, position:"relative", overflow:"hidden", boxShadow:`0 12px 40px rgba(10,22,40,0.3)` }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:11, letterSpacing:3, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>MEMBRE ALAMIN TRAVELS</div>
                  <div style={{ fontSize:20, fontWeight:"bold", color:"#fff" }}>Mohamed Ali Hassan</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>m.ali@gmail.com</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:36 }}>{clientTier?.emoji}</div>
                  <div style={{ fontSize:16, fontWeight:"bold", color:clientTier?.color }}>{clientTier?.name}</div>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:28, fontWeight:"bold", color:C.gold }}>{clientPoints.toLocaleString()} pts</span>
                  {nextTier && <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)", alignSelf:"center" }}>{nextTier.name} → {nextTier.min.toLocaleString()} pts</span>}
                </div>
                <div style={{ height:8, borderRadius:4, background:"rgba(255,255,255,0.15)", overflow:"hidden" }}>
                  <div style={{ height:"100%", background:`linear-gradient(90deg,${C.gold},#f5e07a)`, borderRadius:4, width:`${loyaltyPct}%`, transition:"width 1.5s ease" }}/>
                </div>
              </div>
              <div style={{ display:"flex", gap:24 }}>
                {[["3","Voyages"],["5 240$","Dépensé"],[`${clientTier?.discount}%`,"Réduction"]].map(([v,l])=>(
                  <div key={l}><div style={{ fontSize:18, fontWeight:"bold", color:"#fff" }}>{v}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{l}</div></div>
                ))}
              </div>
            </div>
            {/* Tiers */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {LOYALTY_TIERS.map(tier=>(
                <Card key={tier.name} style={{ padding:16, border:`2px solid ${clientTier?.name===tier.name?tier.color:C.gray100}`, background:clientTier?.name===tier.name?"#fafafa":"#fff" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{tier.emoji}</div>
                  <div style={{ fontWeight:"bold", fontSize:14, color:tier.color, marginBottom:4 }}>{tier.name}</div>
                  <div style={{ fontSize:12, color:C.gray500, marginBottom:8 }}>{tier.min.toLocaleString()}+ pts</div>
                  <div style={{ fontSize:13, fontWeight:"bold", color:C.blue }}>-{tier.discount}% vols</div>
                  {clientTier?.name===tier.name && <div style={{ marginTop:8, padding:"3px 8px", background:`${tier.color}22`, borderRadius:4, fontSize:10, color:tier.color, textAlign:"center", fontWeight:"bold" }}>MON NIVEAU</div>}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── WHATSAPP BOT ── */}
        {page==="whatsapp" && (
          <div style={{ maxWidth:440, margin:"0 auto" }}>
            <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, marginBottom:4, textAlign:"center" }}>📱 WhatsApp Bot</h1>
            <p style={{ color:C.gray500, fontSize:14, marginBottom:20, textAlign:"center" }}>Assistante automatique 24h/24</p>
            <div style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ background:"#075E54", padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"#fff", fontWeight:"bold" }}>A</div>
                <div><div style={{ fontWeight:"bold", color:"#fff", fontSize:14 }}>Alamin Travels</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>🟢 En ligne · Répond instantanément</div></div>
              </div>
              <div style={{ background:"#e5ddd5", height:380, overflowY:"auto", padding:"12px", display:"flex", flexDirection:"column", gap:8 }}>
                {botMessages.map((m,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start" }}>
                    <div style={{ maxWidth:"82%", padding:"8px 12px", borderRadius:m.from==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.from==="user"?"#dcf8c6":"#fff", fontSize:12, color:"#333", lineHeight:1.6, whiteSpace:"pre-line", boxShadow:"0 1px 2px rgba(0,0,0,0.1)" }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"#f0f0f0", padding:"6px 10px", display:"flex", gap:5, overflowX:"auto" }}>
                {["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"].map(r=>(
                  <button key={r} onClick={()=>sendBot(r)} style={{ padding:"5px 10px", borderRadius:16, border:"1px solid #ccc", background:"#fff", cursor:"pointer", fontSize:12, fontFamily:"inherit", whiteSpace:"nowrap" }}>{r}</button>
                ))}
              </div>
              <div style={{ background:"#f0f0f0", padding:"8px 10px", display:"flex", gap:8 }}>
                <input value={botInput} onChange={e=>setBotInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendBot()} placeholder="Tapez un message..." style={{ flex:1, padding:"8px 12px", background:"#fff", border:"none", borderRadius:20, fontSize:12, outline:"none", fontFamily:"inherit" }}/>
                <button onClick={()=>sendBot()} style={{ width:36, height:36, borderRadius:"50%", background:"#25D366", border:"none", color:"#fff", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>➤</button>
              </div>
            </div>
            <Card style={{ padding:16, marginTop:16 }}>
              <div style={{ fontSize:12, fontWeight:"bold", color:C.navy, marginBottom:8 }}>Capacités du Bot</div>
              {["✅ Disponible 24h/24 · 7j/7","✅ Réponse en français et arabe","✅ Suivi de réservation","✅ Info Hajj & Omra","✅ Transfert vers agent humain"].map(c=>(
                <div key={c} style={{ fontSize:12, color:C.gray600, marginBottom:4 }}>{c}</div>
              ))}
            </Card>
          </div>
        )}

        {/* ── ADMIN ── */}
        {page==="admin" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h1 style={{ fontSize:26, fontWeight:"bold", color:C.navy, margin:0 }}>⚙️ Back-Office</h1>
                <p style={{ color:C.gray500, fontSize:14, margin:"4px 0 0" }}>Gestion des réservations et clients</p>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              {[[reservations.length,"Total","📋",C.blue],[reservations.filter(r=>r.status==="confirmed"||r.status==="paid").length,"Confirmées","✅",C.green],[reservations.filter(r=>r.status==="pending").length,"En attente","⏳",C.orange],[`${reservations.reduce((s,r)=>s+r.prix,0).toLocaleString()}$`,"Revenus","💰",C.navy]].map(([v,l,icon,color])=>(
                <Card key={l} style={{ padding:18, textAlign:"center" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontSize:22, fontWeight:"bold", color, marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:11, color:C.gray500 }}>{l}</div>
                </Card>
              ))}
            </div>
            {/* Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {["Tous","pending","confirmed","paid"].map(f=>(
                <button key={f} onClick={()=>setAdminFilter(f)} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${adminFilter===f?C.blue:C.gray300}`, background:adminFilter===f?"#eff6ff":"#fff", color:adminFilter===f?C.blue:C.gray700, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                  {f==="Tous"?"Tous":STATUS[f]?.label}
                </button>
              ))}
            </div>
            {/* Reservations */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {reservations.filter(r=>adminFilter==="Tous"||r.status===adminFilter).map(r=>(
                <Card key={r.id} hover onClick={()=>setSelectedRes(selectedRes?.id===r.id?null:r)} style={{ padding:"16px 20px", cursor:"pointer", border:selectedRes?.id===r.id?`1px solid ${C.blue}`:undefined, background:selectedRes?.id===r.id?"#eff6ff":"#fff" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ width:44, height:44, borderRadius:10, background:C.gray50, border:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                        {r.type==="Vol"?"✈️":r.type.includes("Hajj")||r.type.includes("Omra")?"🕌":r.type.includes("Hôtel")?"🏨":"📦"}
                      </div>
                      <div>
                        <div style={{ fontWeight:"bold", fontSize:14 }}>{r.client}</div>
                        <div style={{ fontSize:12, color:C.gray500 }}>{r.id} · {r.dest} · {r.date}</div>
                        {r.pnr && <div style={{ fontSize:11, color:C.blue, fontWeight:600 }}>PNR: {r.pnr}</div>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:18, fontWeight:"bold", color:C.blue }}>{r.prix}$</div>
                      <div style={{ marginTop:4 }}>
                        <span style={{ padding:"3px 8px", borderRadius:4, fontSize:11, fontWeight:"bold", background:STATUS[r.status]?.bg, color:STATUS[r.status]?.color, border:`1px solid ${STATUS[r.status]?.border}` }}>{STATUS[r.status]?.label}</span>
                      </div>
                    </div>
                  </div>
                  {selectedRes?.id===r.id && (
                    <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.gray100}`, display:"flex", gap:8, flexWrap:"wrap" }}>
                      <Btn size="sm" variant="secondary" onClick={e=>{e.stopPropagation();updateRes(r.id,"confirmed",r.pnr);}}>✅ Confirmer</Btn>
                      <Btn size="sm" onClick={e=>{e.stopPropagation();updateRes(r.id,"paid",r.pnr);}}>💳 Payé</Btn>
                      <button onClick={e=>{e.stopPropagation();setShowPNRModal(true);}} style={{ padding:"6px 12px", background:"#fff7ed", border:`1px solid #fed7aa`, borderRadius:8, color:C.orange, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>📋 Ajouter PNR</button>
                      <button onClick={e=>{e.stopPropagation();notifyWA(`📋 ${r.id}\n${r.client}\n${r.dest}\n${r.date}\n${r.prix}$\nPNR:${r.pnr||"N/A"}`);}} style={{ padding:"6px 12px", background:"#f0fdf4", border:`1px solid #bbf7d0`, borderRadius:8, color:"#25D366", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>📱 WhatsApp</button>
                      <button onClick={e=>{e.stopPropagation();updateRes(r.id,"cancelled");}} style={{ padding:"6px 12px", background:"#fef2f2", border:`1px solid #fecaca`, borderRadius:8, color:C.red, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>🚫 Annuler</button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PNR Modal */}
      {showPNRModal && selectedRes && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
          <Card style={{ padding:28, maxWidth:380, width:"100%" }}>
            <h3 style={{ color:C.navy, fontWeight:"bold", marginBottom:4 }}>Ajouter un PNR</h3>
            <p style={{ color:C.gray500, fontSize:13, marginBottom:14 }}>Réservation : {selectedRes.id}</p>
            <Input label="Numéro PNR" value={pnrInput} onChange={setPnrInput} placeholder="Ex: ABC123" />
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="ghost" onClick={()=>setShowPNRModal(false)} fullWidth>Annuler</Btn>
              <Btn onClick={()=>updateRes(selectedRes.id,"confirmed",pnrInput)} fullWidth>Enregistrer</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background:C.navy, color:"rgba(255,255,255,0.6)", marginTop:48, padding:"32px 24px 16px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:24 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:36, height:36, background:`linear-gradient(135deg,${C.gold},#b8902a)`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:"bold", color:C.navy }}>✈</div>
                <div style={{ fontWeight:"bold", color:"#fff", fontSize:16 }}>Alamin Travels</div>
              </div>
              <p style={{ fontSize:12, lineHeight:1.8 }}>Alamin Travels, votre partenaire de confiance pour voyager depuis Djibouti vers le monde entier. IATA Accrédité, service personnalisé et prix compétitifs.</p>
            </div>
            <div>
              <div style={{ fontWeight:"bold", color:"#fff", marginBottom:10, fontSize:13 }}>Services</div>
              {["Vols internationaux","Hôtels","Omra","Voyages organisés","Visa assistance"].map(s=><div key={s} style={{ fontSize:12, marginBottom:5, cursor:"pointer" }}>{s}</div>)}
            </div>
            <div>
              <div style={{ fontWeight:"bold", color:"#fff", marginBottom:10, fontSize:13 }}>Contact</div>
              {["📍 Salines Ouest, Mohamed Kamil Road","📞 +253 21 25 07 17","📱 +253 77 64 64 05","📱 +253 77 64 64 06","📧 reservations@alamintravel-dj.com"].map(c=><div key={c} style={{ fontSize:12, marginBottom:5 }}>{c}</div>)}
            </div>
            <div>
              <div style={{ fontWeight:"bold", color:"#fff", marginBottom:10, fontSize:13 }}>Horaires</div>
              {["Sam - Jeu : 8h00 - 20h00","Vendredi : Fermé","Agent IA : 24h/24 · 7j/7"].map(h=><div key={h} style={{ fontSize:12, marginBottom:5 }}>{h}</div>)}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:16, display:"flex", justifyContent:"space-between", fontSize:11 }}>
            <span>© 2026 Alamin Travels — IATA Accredited Agent · Djibouti</span>
            <span>Propulsé par l'Intelligence Artificielle 🤖</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
        input::placeholder{color:#9ca3af}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px}
      `}</style>
    </div>
  );
}
