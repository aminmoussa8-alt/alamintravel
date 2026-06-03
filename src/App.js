import { useState, useEffect, useRef } from "react";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const B = "#1a6eb5", BD = "#0f52a0", BG = "#050e1f";
const CARD = "rgba(255,255,255,0.04)", BORDER = "rgba(26,110,181,0.2)";
const GREEN = "#22c55e", ORANGE = "#f5a623", RED = "#ef4444", GOLD = "#d4af37";

const AIRPORTS = [
  { code: "DJI", name: "Djibouti Ambouli", city: "Djibouti", flag: "🇩🇯" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", flag: "🇫🇷" },
  { code: "DXB", name: "Dubai International", city: "Dubai", flag: "🇦🇪" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", flag: "🇹🇷" },
  { code: "NBO", name: "Jomo Kenyatta", city: "Nairobi", flag: "🇰🇪" },
  { code: "ADD", name: "Bole International", city: "Addis-Abeba", flag: "🇪🇹" },
  { code: "CAI", name: "Cairo International", city: "Le Caire", flag: "🇪🇬" },
  { code: "JFK", name: "John F. Kennedy", city: "New York", flag: "🇺🇸" },
  { code: "DOH", name: "Hamad International", city: "Doha", flag: "🇶🇦" },
  { code: "JED", name: "King Abdulaziz", city: "Jeddah", flag: "🇸🇦" },
];

const HOTELS = [
  { id:1, name:"Kempinski Palace Djibouti", city:"Djibouti", stars:5, prix:280, note:4.9, img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80", amenities:["Piscine","Spa","Plage privée","WiFi"] },
  { id:2, name:"Sheraton Djibouti", city:"Djibouti", stars:5, prix:210, note:4.6, img:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80", amenities:["Piscine","Restaurant","WiFi"] },
  { id:3, name:"Hotel Le Méridien", city:"Djibouti", stars:4, prix:145, note:4.4, img:"https://images.unsplash.com/photo-1455587734955-081b22074882?w=500&q=80", amenities:["Restaurant","WiFi","Bar"] },
  { id:4, name:"Hilton Makkah", city:"La Mecque", stars:5, prix:450, note:4.8, img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80", amenities:["Vue Kaaba","Halal","Navette"] },
  { id:5, name:"Pullman Zamzam", city:"La Mecque", stars:5, prix:380, note:4.7, img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80", amenities:["Vue Haram","Halal","WiFi"] },
  { id:6, name:"Anwar Al Madinah", city:"Médine", stars:5, prix:320, note:4.8, img:"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&q=80", amenities:["Vue Nabawi","Halal","WiFi"] },
];

const PACKAGES = [
  { id:1, type:"hajj", title:"Hajj Premium", emoji:"🕌", img:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=500&q=80", prix:4500, duree:"21 jours", places:30, inclus:["Vol A/R","Hôtel 5★ vue Kaaba","Hôtel 5★ Médine","Transport","Guide","Repas","Visa Hajj","Assurance"] },
  { id:2, type:"hajj", title:"Hajj Standard", emoji:"🕌", img:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=500&q=80", prix:3200, duree:"21 jours", places:50, inclus:["Vol A/R","Hôtel 4★","Transport","Guide","Petit-déjeuner","Visa Hajj"] },
  { id:3, type:"omra", title:"Omra Ramadan", emoji:"🌙", img:"https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&q=80", prix:2800, duree:"14 jours", places:40, inclus:["Vol A/R","Hôtel 5★","Transport","Guide","Iftar & Suhour","Visa"] },
  { id:4, type:"omra", title:"Omra Économique", emoji:"🌙", img:"https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&q=80", prix:1600, duree:"10 jours", places:60, inclus:["Vol A/R","Hôtel 3★","Transport","Visa"] },
  { id:5, type:"voyage", title:"Circuit Maroc", emoji:"🇲🇦", img:"https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=500&q=80", prix:1800, duree:"10 jours", places:25, inclus:["Vol","Hôtels 4★","Transport privé","Guide","Petits-déjeuners"] },
  { id:6, type:"voyage", title:"Safari Kenya", emoji:"🦁", img:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=500&q=80", prix:2200, duree:"8 jours", places:20, inclus:["Vol","Lodge safari","4x4 inclus","Guide","Pension complète"] },
];

const RESERVATIONS_DATA = [
  { id:"AT-K8X2P9", client:"Mohamed Ali Hassan", type:"Vol", dest:"DJI→CDG", date:"15/07/2026", prix:840, status:"confirmed", pnr:"ABC123", tel:"+253 77 641 234", email:"m.ali@gmail.com" },
  { id:"AT-L9M3Q1", client:"Fatima Omar Said", type:"Hajj Premium", dest:"DJI→JED", date:"20/06/2026", prix:4500, status:"pending", pnr:null, tel:"+253 77 523 456", email:"fatima@gmail.com" },
  { id:"AT-R5T7W2", client:"Ahmed Ibrahim", type:"Hôtel Kempinski", dest:"Djibouti", date:"10/07/2026", prix:1680, status:"confirmed", pnr:"DEF456", tel:"+253 77 789 012", email:"ahmed@gmail.com" },
  { id:"AT-X1Z4B8", client:"Hodan Abdi", type:"Omra", dest:"DJI→JED", date:"01/08/2026", prix:1600, status:"paid", pnr:"GHI789", tel:"+253 77 345 678", email:"hodan@gmail.com" },
  { id:"AT-N6P2C5", client:"Hassan Yusuf", type:"Circuit Maroc", dest:"DJI→CMN", date:"25/07/2026", prix:3600, status:"pending", pnr:null, tel:"+253 77 901 234", email:"hassan@gmail.com" },
];

const CLIENTS_DATA = [
  { id:1, name:"Mohamed Ali Hassan", email:"m.ali@gmail.com", tel:"+253 77 641 234", points:3850, bookings:3, spent:5240, tier:"Silver" },
  { id:2, name:"Fatima Omar Said", email:"fatima@gmail.com", tel:"+253 77 523 456", points:4500, bookings:1, spent:4500, tier:"Silver" },
  { id:3, name:"Ahmed Ibrahim", email:"ahmed@gmail.com", tel:"+253 77 789 012", points:12800, bookings:5, spent:12800, tier:"Platinum" },
  { id:4, name:"Hodan Abdi", email:"hodan@gmail.com", tel:"+253 77 345 678", points:1600, bookings:2, spent:3200, tier:"Bronze" },
];

const LOYALTY_TIERS = [
  { name:"Bronze", emoji:"🥉", min:0, max:2000, color:"#cd7f32", discount:5 },
  { name:"Silver", emoji:"🥈", min:2000, max:5000, color:"#C0C0C0", discount:10 },
  { name:"Gold", emoji:"🥇", min:5000, max:10000, color:GOLD, discount:15 },
  { name:"Platinum", emoji:"💎", min:10000, max:Infinity, color:"#e5e4e2", discount:20 },
];

const LIVE_FLIGHTS = [
  { ref:"AT-K8X2P9", flight:"ET509", airline:"Ethiopian Airlines", from:"DJI", to:"CDG", status:"En vol", progress:65, depart:"08:00", arrivee:"14:30", eta:"14:28" },
  { ref:"AT-X1Z4B8", flight:"TK764", airline:"Turkish Airlines", from:"DJI", to:"IST", status:"À l'heure", progress:20, depart:"23:30", arrivee:"05:15", eta:"05:12" },
];

const BOT_FLOWS = [
  { trigger:"bonjour", reply:"👋 Bienvenue chez Alamin Tourism & Travel!\n\n1️⃣ Vol\n2️⃣ Hôtel\n3️⃣ Hajj/Omra\n4️⃣ Ma réservation\n5️⃣ Agent humain" },
  { trigger:"1", reply:"✈️ Quelle destination souhaitez-vous?\nDe: Djibouti (DJI)\nVers: ?" },
  { trigger:"4", reply:"📋 Entrez votre référence (ex: AT-K8X2P9)" },
  { trigger:"AT-K8X2P9", reply:"✅ Résa AT-K8X2P9\n👤 Mohamed Ali Hassan\n✈️ ET509 DJI→CDG\n📅 15/07/2026\n💰 840$\n🟢 CONFIRMÉ" },
  { trigger:"5", reply:"📞 Un agent va vous contacter.\nTél: +253 77 02 07 07\n📧 reservations@alamintravel-dj.com" },
];

const STATUS_COLORS = { confirmed:GREEN, pending:ORANGE, paid:B, cancelled:RED };
const STATUS_LABELS = { confirmed:"✅ Confirmé", pending:"⏳ En attente", paid:"💳 Payé", cancelled:"🚫 Annulé" };

const inp = (label, val, onChange, type="text", placeholder="") => (
  <div>
    <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:6}}>{label.toUpperCase()}</div>
    <input type={type} value={val} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"11px 14px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:"#f0ebe0",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}} />
  </div>
);

const Btn = ({children, onClick, disabled, color="blue", small=false}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "7px 14px" : "12px 20px",
    background: disabled ? "rgba(26,110,181,0.15)" : color === "blue" ? `linear-gradient(135deg,${B},${BD})` : color === "green" ? "linear-gradient(135deg,#22c55e,#16a34a)" : color === "orange" ? "linear-gradient(135deg,#f5a623,#e8870a)" : color,
    border: "none", borderRadius: small ? 16 : 12, color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer", fontWeight:"bold", letterSpacing:1,
    fontSize: small ? 11 : 13, fontFamily:"inherit", transition:"all 0.2s"
  }}>{children}</button>
);

const notifyWhatsApp = (msg) => {
  const url = `https://wa.me/25377020707?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
};

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function AlaminComplete() {
  const [page, setPage] = useState("home");
  const [subTab, setSubTab] = useState("");

  // Vols state
  const [search, setSearch] = useState({ origin:"DJI", destination:"CDG", date:"", adults:"1", class:"ECONOMY", type:"oneway" });
  const [flights, setFlights] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Hotels state
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelFilter, setHotelFilter] = useState("Tous");
  const [nights, setNights] = useState(3);

  // Packages state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pkgFilter, setPkgFilter] = useState("Tous");

  // Booking state
  const [bookStep, setBookStep] = useState(0);
  const [form, setForm] = useState({ prenom:"", nom:"", email:"", tel:"", passport:"", dob:"", paiement:"agence" });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Admin state
  const [reservations, setReservations] = useState(RESERVATIONS_DATA);
  const [selectedRes, setSelectedRes] = useState(null);
  const [pnrInput, setPnrInput] = useState("");
  const [showPNRModal, setShowPNRModal] = useState(false);

  // Chat / Agent IA
  const [messages, setMessages] = useState([{ role:"assistant", content:"Bienvenue chez **Alamin Tourism & Travel** 🌍\n\nJe suis votre conseiller IA. Comment puis-je vous aider aujourd'hui?" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef(null);

  // WhatsApp Bot
  const [botMessages, setBotMessages] = useState([{ from:"bot", text:"👋 Bienvenue chez Alamin Tourism & Travel!\n\n1️⃣ Vol\n2️⃣ Hôtel\n3️⃣ Hajj/Omra\n4️⃣ Ma réservation\n5️⃣ Agent humain" }]);
  const [botInput, setBotInput] = useState("");

  // Loyalty
  const currentClient = CLIENTS_DATA[0];
  const currentTier = LOYALTY_TIERS.find(t => currentClient.points >= t.min && currentClient.points < t.max);
  const nextTier = LOYALTY_TIERS[LOYALTY_TIERS.indexOf(currentTier)+1];
  const loyaltyPct = nextTier ? ((currentClient.points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  // Flight tracker
  const [trackedFlight, setTrackedFlight] = useState(LIVE_FLIGHTS[0]);
  const [trackProgress, setTrackProgress] = useState(0);
  useEffect(() => { setTimeout(() => setTrackProgress(trackedFlight.progress), 600); }, [trackedFlight]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  // ── MOCK FLIGHT SEARCH ─────────────────────────────────────────────────────
  const searchFlights = async () => {
    if (!search.date) return;
    setSearchLoading(true); setFlights([]);
    await new Promise(r => setTimeout(r, 1500));
    const mockFlights = [
      { id:1, carrier:"ET", num:"509", airline:"Ethiopian Airlines", logo:"🇪🇹", dep:search.origin, arr:search.destination, depTime:"08:00", arrTime:"14:30", stops:"Direct", duration:"6h30", price: Math.round(350 + Math.random()*200), class:search.class },
      { id:2, carrier:"TK", num:"764", airline:"Turkish Airlines", logo:"🇹🇷", dep:search.origin, arr:search.destination, depTime:"23:30", arrTime:"13:45+1", stops:"1 escale", duration:"14h15", price: Math.round(280 + Math.random()*150), class:search.class },
      { id:3, carrier:"EK", num:"723", airline:"Emirates", logo:"🇦🇪", dep:search.origin, arr:search.destination, depTime:"14:00", arrTime:"20:30", stops:"1 escale", duration:"6h30", price: Math.round(420 + Math.random()*300), class:search.class },
      { id:4, carrier:"AF", num:"490", airline:"Air France", logo:"🇫🇷", dep:search.origin, arr:search.destination, depTime:"11:45", arrTime:"20:15", stops:"1 escale", duration:"8h30", price: Math.round(400 + Math.random()*200), class:search.class },
      { id:5, carrier:"KQ", num:"205", airline:"Kenya Airways", logo:"🦁", dep:search.origin, arr:search.destination, depTime:"06:15", arrTime:"18:00", stops:"1 escale", duration:"11h45", price: Math.round(300 + Math.random()*150), class:search.class },
    ].sort((a,b) => a.price - b.price);
    setFlights(mockFlights);
    setSearchLoading(false);
  };

  // ── AI CHAT ────────────────────────────────────────────────────────────────
  const sendChat = async (text) => {
    const t = text || chatInput.trim();
    if (!t || chatLoading) return;
    setChatInput("");
    const userMsg = { role:"user", content:t };
    const hist = [...messages, userMsg];
    setMessages(hist);
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:800,
          system:`Tu es Horizon, conseiller voyage d'Alamin Tourism & Travel à Djibouti. Réponds en français avec passion. Spécialiste Djibouti, Hajj/Omra, voyages Afrique. Sois concis - max 250 mots. Utilise **gras** et emojis.`,
          messages: hist.map(m => ({ role:m.role, content:m.content }))
        })
      });
      const d = await res.json();
      setMessages([...hist, { role:"assistant", content: d.content?.[0]?.text || "Désolé, erreur." }]);
    } catch {
      setMessages([...hist, { role:"assistant", content:"⚠️ Erreur de connexion." }]);
    }
    setChatLoading(false);
  };

  // ── WHATSAPP BOT ───────────────────────────────────────────────────────────
  const sendBot = (text) => {
    const t = text || botInput.trim();
    if (!t) return;
    setBotInput("");
    const flow = BOT_FLOWS.find(f => t.toLowerCase().includes(f.trigger.toLowerCase()));
    const reply = flow ? flow.reply : "Un agent va vous contacter.\n📞 +253 77 02 07 07";
    setBotMessages(prev => [...prev, { from:"user", text:t }, { from:"bot", text:reply }]);
  };

  // ── BOOKING CONFIRM ────────────────────────────────────────────────────────
  const confirmBooking = () => {
    const ref = "AT-" + Math.random().toString(36).substr(2,8).toUpperCase();
    const item = selectedFlight || selectedHotel || selectedPackage;
    const bk = { ref, ...form, item, nights, type: selectedFlight ? "Vol" : selectedHotel ? "Hôtel" : "Package" };
    setConfirmedBooking(bk);
    setBookStep(3);
    notifyWhatsApp(`🎉 NOUVELLE RÉSERVATION — Alamin Travel\nRef: ${ref}\nClient: ${form.prenom} ${form.nom}\nEmail: ${form.email}\nTél: ${form.tel}\nType: ${bk.type}\nPaiement: ${form.paiement}`);
  };

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  const updateReservation = (id, status, pnr) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status, ...(pnr && { pnr }) } : r));
    setSelectedRes(null); setShowPNRModal(false); setPnrInput("");
    const r = reservations.find(r => r.id === id);
    if (r) notifyWhatsApp(`✅ MAJ Réservation ${id}\nClient: ${r.client}\nStatut: ${STATUS_LABELS[status]}${pnr ? `\nPNR: ${pnr}` : ""}`);
  };

  // ── NAV TABS ───────────────────────────────────────────────────────────────
  const MAIN_TABS = [
    ["home","🏠","Accueil"],["vols","✈️","Vols"],["hotels","🏨","Hôtels"],
    ["packages","🕌","Packages"],["agent","💬","Agent IA"],
    ["tracker","📍","Tracker"],["loyalty","⭐","Fidélité"],
    ["whatsapp","📱","WhatsApp"],["admin","🔧","Admin"],
  ];

  const navBtn = (tab, icon, label) => (
    <button key={tab} onClick={() => { setPage(tab); setBookStep(0); setSelectedFlight(null); setSelectedHotel(null); setSelectedPackage(null); setConfirmedBooking(null); }}
      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 10px", borderRadius:12, border:"1px solid", borderColor: page===tab ? B : "rgba(26,110,181,0.12)", background: page===tab ? "rgba(26,110,181,0.12)" : "transparent", color: page===tab ? B : "rgba(255,255,255,0.4)", cursor:"pointer", fontSize:10, fontFamily:"inherit", letterSpacing:1, minWidth:52 }}>
      <span style={{fontSize:16}}>{icon}</span>{label.toUpperCase()}
    </button>
  );

  // ── BOOKING FLOW ───────────────────────────────────────────────────────────
  const renderBooking = () => {
    if (bookStep === 0) return null;
    const item = selectedFlight || selectedHotel || selectedPackage;
    const total = selectedFlight ? selectedFlight.price * parseInt(form.adults||1) :
                  selectedHotel ? selectedHotel.prix * nights :
                  selectedPackage ? selectedPackage.prix : 0;

    if (bookStep === 3 && confirmedBooking) return (
      <div style={{maxWidth:520,margin:"0 auto",textAlign:"center",padding:"20px 0"}}>
        <div style={{width:68,height:68,borderRadius:"50%",background:`linear-gradient(135deg,${B},${BD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px",boxShadow:`0 0 30px rgba(26,110,181,0.4)`}}>✓</div>
        <h2 style={{fontSize:24,color:B,fontWeight:"normal",letterSpacing:2,marginBottom:6}}>Réservation Confirmée!</h2>
        <div style={{fontSize:20,fontWeight:"bold",color:B,letterSpacing:3,marginBottom:20}}>{confirmedBooking.ref}</div>
        <div style={{padding:"16px 20px",borderRadius:14,background:"rgba(26,110,181,0.06)",border:`1px solid ${BORDER}`,marginBottom:16,textAlign:"left"}}>
          {[["Type",confirmedBooking.type],["Client",`${confirmedBooking.prenom} ${confirmedBooking.nom}`],["Email",confirmedBooking.email],["Tél",confirmedBooking.tel],["Paiement",confirmedBooking.paiement==="agence"?"Payer à l'agence":"Payer plus tard"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
              <span style={{color:"rgba(255,255,255,0.4)"}}>{l}</span>
              <span style={{color:"#f0ebe0"}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:20,lineHeight:1.8}}>
          📱 Notification envoyée au +253 77 02 07 07<br/>
          📧 Confirmation à {confirmedBooking.email}<br/>
          📍 Salines Ouest, Mohamed Kamil Road, Djibouti
        </div>
        <Btn onClick={()=>{setBookStep(0);setSelectedFlight(null);setSelectedHotel(null);setSelectedPackage(null);setConfirmedBooking(null);setForm({prenom:"",nom:"",email:"",tel:"",passport:"",dob:"",paiement:"agence"});}}>NOUVELLE RÉSERVATION →</Btn>
      </div>
    );

    if (bookStep === 2) return (
      <div style={{maxWidth:580,margin:"0 auto"}}>
        <h2 style={{fontSize:20,color:B,fontWeight:"normal",letterSpacing:2,marginBottom:20}}>Vos Informations</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {inp("Prénom *",form.prenom,v=>setForm(p=>({...p,prenom:v})))}
          {inp("Nom *",form.nom,v=>setForm(p=>({...p,nom:v})))}
          {inp("Email *",form.email,v=>setForm(p=>({...p,email:v})),"email")}
          {inp("Téléphone *",form.tel,v=>setForm(p=>({...p,tel:v})),"tel")}
          {inp("N° Passeport",form.passport,v=>setForm(p=>({...p,passport:v})))}
          {inp("Date naissance",form.dob,v=>setForm(p=>({...p,dob:v})),"date")}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:8}}>MODE DE PAIEMENT</div>
          {[["agence","🏢 Payer à l'agence","Salines Ouest, Mohamed Kamil Road"],["later","⏰ Payer plus tard","Réservation maintenue 48h"]].map(([v,l,sub])=>(
            <div key={v} onClick={()=>setForm(p=>({...p,paiement:v}))} style={{padding:"11px 14px",borderRadius:10,border:`1px solid ${form.paiement===v?B:BORDER}`,background:form.paiement===v?"rgba(26,110,181,0.08)":CARD,cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${form.paiement===v?B:"rgba(255,255,255,0.2)"}`,background:form.paiement===v?B:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{form.paiement===v?"✓":""}</div>
              <div><div style={{fontSize:13,fontWeight:"bold"}}>{l}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{sub}</div></div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(26,110,181,0.06)",border:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <span>Total</span><span style={{fontSize:18,fontWeight:"bold",color:B}}>{total}$</span>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>setBookStep(1)} style={{flex:1,padding:"12px",background:"transparent",border:`1px solid ${BORDER}`,borderRadius:12,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>← RETOUR</button>
          <Btn onClick={confirmBooking} disabled={!form.prenom||!form.email}>✅ CONFIRMER</Btn>
        </div>
      </div>
    );

    return (
      <div style={{maxWidth:580,margin:"0 auto"}}>
        <h2 style={{fontSize:20,color:B,fontWeight:"normal",letterSpacing:2,marginBottom:16}}>Récapitulatif</h2>
        <div style={{padding:"16px 18px",borderRadius:14,background:"rgba(26,110,181,0.06)",border:`1px solid ${BORDER}`,marginBottom:16}}>
          {selectedFlight && <>
            <div style={{fontWeight:"bold",fontSize:16,marginBottom:8}}>{selectedFlight.logo} {selectedFlight.airline}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:4}}>{selectedFlight.dep} → {selectedFlight.arr} · {selectedFlight.depTime}→{selectedFlight.arrTime}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{selectedFlight.stops} · {selectedFlight.duration} · {selectedFlight.class}</div>
          </>}
          {selectedHotel && <>
            <div style={{fontWeight:"bold",fontSize:16,marginBottom:4}}>{selectedHotel.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:8}}>{selectedHotel.city} · {"⭐".repeat(selectedHotel.stars)}</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:12}}>Nuits :</span>
              <button onClick={()=>setNights(n=>Math.max(1,n-1))} style={{width:26,height:26,borderRadius:"50%",background:"rgba(26,110,181,0.1)",border:`1px solid ${BORDER}`,color:B,cursor:"pointer",fontFamily:"inherit"}}>−</button>
              <span style={{fontSize:16,fontWeight:"bold",color:B}}>{nights}</span>
              <button onClick={()=>setNights(n=>n+1)} style={{width:26,height:26,borderRadius:"50%",background:"rgba(26,110,181,0.1)",border:`1px solid ${BORDER}`,color:B,cursor:"pointer",fontFamily:"inherit"}}>+</button>
            </div>
          </>}
          {selectedPackage && <>
            <div style={{fontWeight:"bold",fontSize:16,marginBottom:4}}>{selectedPackage.emoji} {selectedPackage.title}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:8}}>{selectedPackage.duree} · {selectedPackage.places} places</div>
            <div>{selectedPackage.inclus.slice(0,4).map(i=><div key={i} style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:2}}>✓ {i}</div>)}</div>
          </>}
          <div style={{borderTop:`1px solid ${BORDER}`,marginTop:12,paddingTop:12,display:"flex",justifyContent:"space-between",fontWeight:"bold"}}>
            <span>TOTAL</span><span style={{color:B,fontSize:20}}>{total}$</span>
          </div>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>setBookStep(0)} style={{flex:1,padding:"12px",background:"transparent",border:`1px solid ${BORDER}`,borderRadius:12,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>← RETOUR</button>
          <Btn onClick={()=>setBookStep(2)}>CONTINUER →</Btn>
        </div>
      </div>
    );
  };

  const fmt = (text) => text.split("\n").map((l,i,a)=>(
    <span key={i}><span dangerouslySetInnerHTML={{__html:l.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>")}} />{i<a.length-1&&<br/>}</span>
  ));

  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Georgia',serif",color:"#f0ebe0",display:"flex",flexDirection:"column"}}>

      {/* Header */}
      <header style={{background:"linear-gradient(135deg,#0d1117,#1a1025)",borderBottom:`1px solid ${BORDER}`,padding:"0 16px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:`linear-gradient(135deg,${B},#4da3e8)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:`0 0 16px rgba(26,110,181,0.4)`}}>✦</div>
          <div>
            <div style={{fontSize:13,letterSpacing:3,color:B,fontWeight:"bold",lineHeight:1}}>ALAMIN TOURISM & TRAVEL</div>
            <div style={{fontSize:8,letterSpacing:2,color:"rgba(26,110,181,0.4)",marginTop:2}}>IATA ACCREDITED · DJIBOUTI</div>
          </div>
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>📞 +253 77 02 07 07</div>
      </header>

      {/* Nav */}
      <div style={{background:"rgba(255,255,255,0.02)",borderBottom:`1px solid ${BORDER}`,padding:"8px 12px",overflowX:"auto"}}>
        <div style={{display:"flex",gap:6,minWidth:"max-content"}}>
          {MAIN_TABS.map(([tab,icon,label])=>navBtn(tab,icon,label))}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,maxWidth:1060,margin:"0 auto",width:"100%",padding:"20px 14px",boxSizing:"border-box"}}>

        {/* ── HOME ── */}
        {page==="home" && (
          <div>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:11,letterSpacing:4,color:B,marginBottom:8}}>VOTRE AGENCE DE VOYAGE INTELLIGENTE</div>
              <h1 style={{fontSize:32,fontWeight:"normal",letterSpacing:2,margin:"0 0 8px"}}>Alamin Tourism & Travel</h1>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>Djibouti · IATA Accredited · Propulsé par l'IA</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:32}}>
              {[["✈️","Vols","Amadeus temps réel","vols"],["🏨","Hôtels","Djibouti & Monde","hotels"],["🕌","Hajj & Omra","Packages complets","packages"],["💬","Agent IA","Conseiller 24h/24","agent"],["📍","Tracker","Suivi vols live","tracker"],["⭐","Fidélité","Points & Avantages","loyalty"],["📱","WhatsApp Bot","Réponse instantanée","whatsapp"],["🔧","Admin","Back-office","admin"]].map(([icon,title,sub,tab])=>(
                <div key={tab} onClick={()=>setPage(tab)} style={{padding:"20px",borderRadius:14,border:`1px solid ${BORDER}`,background:CARD,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=B;e.currentTarget.style.background="rgba(26,110,181,0.06)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background=CARD;}}>
                  <div style={{fontSize:32,marginBottom:8}}>{icon}</div>
                  <div style={{fontWeight:"bold",fontSize:14,marginBottom:4}}>{title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {[["500+","Clients"],["15+","Destinations"],["24/7","Support IA"],["IATA","Accrédité"]].map(([v,l])=>(
                <div key={l} style={{padding:"16px",borderRadius:12,background:"rgba(26,110,181,0.06)",border:`1px solid ${BORDER}`,textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:"bold",color:B}}>{v}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",letterSpacing:1}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── VOLS ── */}
        {page==="vols" && bookStep===0 && (
          <div>
            <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,marginBottom:20}}>✈️ RECHERCHE DE VOLS</h2>
            <div style={{padding:"20px",borderRadius:16,background:CARD,border:`1px solid ${BORDER}`,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:6}}>DÉPART</div>
                  <select value={search.origin} onChange={e=>setSearch(p=>({...p,origin:e.target.value}))} style={{width:"100%",padding:"11px 14px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:"#f0ebe0",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    {AIRPORTS.map(a=><option key={a.code} value={a.code} style={{background:"#1a1025"}}>{a.flag} {a.city} ({a.code})</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:6}}>DESTINATION</div>
                  <select value={search.destination} onChange={e=>setSearch(p=>({...p,destination:e.target.value}))} style={{width:"100%",padding:"11px 14px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:"#f0ebe0",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    {AIRPORTS.map(a=><option key={a.code} value={a.code} style={{background:"#1a1025"}}>{a.flag} {a.city} ({a.code})</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:6}}>DATE</div>
                  <input type="date" value={search.date} onChange={e=>setSearch(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:"11px 14px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:"#f0ebe0",fontSize:13,outline:"none",boxSizing:"border-box"}} />
                </div>
                <div>
                  <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:6}}>VOYAGEURS</div>
                  <select value={search.adults} onChange={e=>setSearch(p=>({...p,adults:e.target.value}))} style={{width:"100%",padding:"11px 14px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:"#f0ebe0",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    {[1,2,3,4,5,6].map(n=><option key={n} value={n} style={{background:"#1a1025"}}>{n} adulte{n>1?"s":""}</option>)}
                  </select>
                </div>
              </div>
              <Btn onClick={searchFlights} disabled={searchLoading||!search.date}>
                {searchLoading ? "⏳ RECHERCHE..." : "🔍 RECHERCHER"}
              </Btn>
            </div>
            {flights.length > 0 && (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4,letterSpacing:1}}>{flights.length} VOLS TROUVÉS · {search.origin}→{search.destination}</div>
                {flights.map(f=>(
                  <div key={f.id} onClick={()=>{setSelectedFlight(f);setBookStep(1);}} style={{padding:"14px 18px",borderRadius:14,border:`1px solid ${BORDER}`,background:CARD,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=B;e.currentTarget.style.background="rgba(26,110,181,0.06)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background=CARD;}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:24}}>{f.logo}</span>
                      <div>
                        <div style={{fontWeight:"bold",fontSize:13}}>{f.airline}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{f.stops} · {f.duration}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:16,fontWeight:"bold"}}>{f.depTime} <span style={{color:B}}>→</span> {f.arrTime}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{f.dep}→{f.arr}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:24,fontWeight:"bold",color:B}}>{f.price}$</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>/ personne</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {page==="vols" && bookStep>0 && renderBooking()}

        {/* ── HOTELS ── */}
        {page==="hotels" && bookStep===0 && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
              <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,margin:0}}>🏨 HÔTELS</h2>
              <div style={{display:"flex",gap:6}}>
                {["Tous","Djibouti","La Mecque","Médine"].map(c=>(
                  <button key={c} onClick={()=>setHotelFilter(c)} style={{padding:"5px 12px",borderRadius:14,border:"1px solid",borderColor:hotelFilter===c?B:BORDER,background:hotelFilter===c?"rgba(26,110,181,0.12)":"transparent",color:hotelFilter===c?B:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              {HOTELS.filter(h=>hotelFilter==="Tous"||h.city===hotelFilter).map(h=>(
                <div key={h.id} style={{borderRadius:16,overflow:"hidden",border:`1px solid ${BORDER}`,transition:"all 0.3s",cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=B;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.4)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{position:"relative",height:150}}>
                    <img src={h.img} alt={h.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,14,31,0.8) 0%,transparent 55%)"}} />
                    <div style={{position:"absolute",bottom:10,left:12,color:B,fontSize:12}}>{"⭐".repeat(h.stars)}</div>
                    <div style={{position:"absolute",top:10,right:10,background:"rgba(26,110,181,0.9)",borderRadius:14,padding:"3px 10px",fontSize:11,color:"#fff"}}>{h.city}</div>
                  </div>
                  <div style={{padding:"14px 16px",background:"rgba(255,255,255,0.02)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{fontWeight:"bold",fontSize:13}}>{h.name}</div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:18,fontWeight:"bold",color:B}}>{h.prix}$</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>/nuit</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                      {h.amenities.slice(0,3).map(a=><span key={a} style={{fontSize:10,padding:"2px 8px",background:"rgba(26,110,181,0.08)",borderRadius:10,color:"rgba(255,255,255,0.4)"}}>{a}</span>)}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>⭐ {h.note}</span>
                      <Btn small onClick={()=>{setSelectedHotel(h);setBookStep(1);}}>RÉSERVER →</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {page==="hotels" && bookStep>0 && renderBooking()}

        {/* ── PACKAGES ── */}
        {page==="packages" && bookStep===0 && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
              <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,margin:0}}>🕌 PACKAGES</h2>
              <div style={{display:"flex",gap:6}}>
                {[["Tous","Tous"],["hajj","🕌 Hajj"],["omra","🌙 Omra"],["voyage","✈️ Voyages"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setPkgFilter(v)} style={{padding:"5px 12px",borderRadius:14,border:"1px solid",borderColor:pkgFilter===v?B:BORDER,background:pkgFilter===v?"rgba(26,110,181,0.12)":"transparent",color:pkgFilter===v?B:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
              {PACKAGES.filter(p=>pkgFilter==="Tous"||p.type===pkgFilter).map(p=>(
                <div key={p.id} style={{borderRadius:16,overflow:"hidden",border:`1px solid ${BORDER}`,transition:"all 0.3s",cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=B;e.currentTarget.style.transform="translateY(-4px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.transform="none";}}>
                  <div style={{position:"relative",height:150}}>
                    <img src={p.img} alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,14,31,0.85) 0%,transparent 50%)"}} />
                    <div style={{position:"absolute",top:10,left:10,background:"rgba(26,110,181,0.9)",borderRadius:14,padding:"3px 10px",fontSize:11,color:"#fff"}}>{p.duree}</div>
                    <div style={{position:"absolute",bottom:10,left:12,fontSize:22}}>{p.emoji}</div>
                  </div>
                  <div style={{padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontWeight:"bold",fontSize:14}}>{p.title}</div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:18,fontWeight:"bold",color:B}}>{p.prix}$</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>/personne</div>
                      </div>
                    </div>
                    <div style={{marginBottom:10}}>
                      {p.inclus.slice(0,3).map(i=><div key={i} style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:2}}>✓ {i}</div>)}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>👥 {p.places} places</span>
                      <Btn small onClick={()=>{setSelectedPackage(p);setBookStep(1);}}>RÉSERVER →</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {page==="packages" && bookStep>0 && renderBooking()}

        {/* ── AGENT IA ── */}
        {page==="agent" && (
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 220px)",minHeight:400}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${B},#4da3e8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 8px",boxShadow:`0 0 24px rgba(26,110,181,0.3)`}}>✦</div>
              <div style={{fontSize:14,color:B,letterSpacing:2}}>HORIZON — AGENT IA</div>
            </div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,padding:"4px 0 12px"}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:8,justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-start"}}>
                  {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${B},#4da3e8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginTop:4}}>✦</div>}
                  <div style={{maxWidth:"75%",padding:"11px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px",background:m.role==="user"?`linear-gradient(135deg,${B},${BD})`:"rgba(255,255,255,0.04)",border:m.role==="user"?"none":`1px solid ${BORDER}`,color:m.role==="user"?"#fff":"#f0ebe0",fontSize:13,lineHeight:1.7}}>
                    {fmt(m.content)}
                  </div>
                </div>
              ))}
              {chatLoading&&<div style={{display:"flex",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${B},#4da3e8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✦</div><div style={{padding:"11px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:"4px 16px 16px 16px",display:"flex",gap:4}}>{[0,1,2].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:B,animation:`pulse 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div></div>}
              <div ref={endRef}/>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {["✈️ Vol Djibouti-Paris","🕌 Package Hajj","🏨 Hôtel Mecque","🦈 Nager requins baleines"].map(s=>(
                <button key={s} onClick={()=>sendChat(s)} style={{padding:"5px 10px",background:"rgba(26,110,181,0.07)",border:`1px solid ${BORDER}`,borderRadius:14,color:"#4da3e8",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>{s}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,background:"rgba(255,255,255,0.04)",border:`1px solid rgba(26,110,181,0.3)`,borderRadius:24,padding:"7px 7px 7px 14px",alignItems:"center"}}>
              <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder="Demandez un itinéraire, un prix, un conseil..." rows={1} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#f0ebe0",fontSize:13,resize:"none",fontFamily:"inherit",lineHeight:1.5}}/>
              <button onClick={()=>sendChat()} disabled={chatLoading||!chatInput.trim()} style={{width:36,height:36,borderRadius:"50%",background:chatInput.trim()&&!chatLoading?`linear-gradient(135deg,${B},${BD})`:"rgba(26,110,181,0.1)",border:"none",cursor:chatInput.trim()&&!chatLoading?"pointer":"not-allowed",color:"#fff",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>➤</button>
            </div>
          </div>
        )}

        {/* ── TRACKER ── */}
        {page==="tracker" && (
          <div>
            <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,marginBottom:20}}>📍 SUIVI DE VOLS EN DIRECT</h2>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {LIVE_FLIGHTS.map(f=>(
                <button key={f.ref} onClick={()=>{setTrackedFlight(f);setTrackProgress(0);setTimeout(()=>setTrackProgress(f.progress),300);}} style={{padding:"8px 14px",borderRadius:16,border:"1px solid",borderColor:trackedFlight.ref===f.ref?B:BORDER,background:trackedFlight.ref===f.ref?"rgba(26,110,181,0.12)":"transparent",color:trackedFlight.ref===f.ref?B:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✈️ {f.flight}</button>
              ))}
            </div>
            <div style={{padding:"20px",borderRadius:16,border:`1px solid ${BORDER}`,background:CARD,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontSize:20,fontWeight:"bold",marginBottom:4}}>✈️ {trackedFlight.flight}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>{trackedFlight.airline}</div>
                </div>
                <div style={{padding:"6px 14px",borderRadius:16,background:trackedFlight.status==="En vol"?"rgba(34,197,94,0.15)":"rgba(245,166,35,0.15)",border:`1px solid ${trackedFlight.status==="En vol"?"rgba(34,197,94,0.3)":"rgba(245,166,35,0.3)"}`,color:trackedFlight.status==="En vol"?GREEN:ORANGE,fontWeight:"bold",fontSize:12,display:"flex",alignItems:"center"}}>
                  {trackedFlight.status==="En vol"?"🟢":"🟡"} {trackedFlight.status}
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:"bold",color:B}}>{trackedFlight.from}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{trackedFlight.depart}</div>
                </div>
                <div style={{flex:1,margin:"0 16px",position:"relative"}}>
                  <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2}}>
                    <div style={{height:"100%",background:`linear-gradient(90deg,${B},#4da3e8)`,borderRadius:2,width:`${trackProgress}%`,transition:"width 1.5s ease"}}/>
                    <div style={{position:"absolute",top:"50%",left:`${trackProgress}%`,transform:"translate(-50%,-50%)",fontSize:18,transition:"left 1.5s ease"}}>✈️</div>
                  </div>
                  <div style={{textAlign:"center",marginTop:10,fontSize:12,color:"rgba(255,255,255,0.4)"}}>{trackProgress}% du trajet</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:"bold",color:B}}>{trackedFlight.to}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{trackedFlight.arrivee}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["📍 Réf",trackedFlight.ref],["⏰ ETA",trackedFlight.eta],["📊 Progression",`${trackedFlight.progress}%`]].map(([l,v])=>(
                  <div key={l} style={{padding:"10px",borderRadius:10,background:"rgba(26,110,181,0.06)",textAlign:"center"}}>
                    <div style={{fontSize:14,fontWeight:"bold",color:B}}>{v}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LOYALTY ── */}
        {page==="loyalty" && (
          <div>
            <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,marginBottom:20}}>⭐ PROGRAMME DE FIDÉLITÉ</h2>
            <div style={{borderRadius:18,background:`linear-gradient(135deg,${BD},#0a1a35,${B})`,padding:"22px 24px",marginBottom:20,position:"relative",overflow:"hidden",boxShadow:`0 20px 50px rgba(26,110,181,0.25)`}}>
              <div style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,0.03)"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.5)",marginBottom:4}}>MEMBRE ALAMIN TRAVEL</div>
                  <div style={{fontSize:18,fontWeight:"bold"}}>{currentClient.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{currentClient.email}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:32}}>{currentTier?.emoji}</div>
                  <div style={{fontSize:14,fontWeight:"bold",color:currentTier?.color}}>{currentTier?.name}</div>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:24,fontWeight:"bold",color:GOLD}}>{currentClient.points.toLocaleString()} pts</span>
                  {nextTier&&<span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>→ {nextTier.name} à {nextTier.min.toLocaleString()} pts</span>}
                </div>
                <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}>
                  <div style={{height:"100%",background:`linear-gradient(90deg,${GOLD},#f5e07a)`,borderRadius:4,width:`${loyaltyPct}%`,transition:"width 1.5s ease"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:20}}>
                {[[currentClient.bookings,"Voyages"],[`${currentClient.spent.toLocaleString()}$`,"Dépensé"],[`${currentTier?.discount}%`,"Réduction"]].map(([v,l])=>(
                  <div key={l} style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:"bold",color:"#fff"}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{l}</div></div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
              {LOYALTY_TIERS.map(tier=>(
                <div key={tier.name} style={{padding:"16px",borderRadius:14,border:`2px solid ${currentTier?.name===tier.name?tier.color:"rgba(255,255,255,0.06)"}`,background:currentTier?.name===tier.name?"rgba(255,255,255,0.04)":CARD}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:24}}>{tier.emoji}</span>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:14,fontWeight:"bold",color:tier.color}}>{tier.name}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{tier.min.toLocaleString()}+ pts</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,fontWeight:"bold",color:tier.color,marginBottom:4}}>-{tier.discount}% sur vols</div>
                  {currentTier?.name===tier.name&&<div style={{marginTop:8,padding:"3px 8px",background:`rgba(${tier.color===GOLD?"212,175,55":"26,110,181"},0.15)`,borderRadius:8,fontSize:10,color:tier.color,textAlign:"center"}}>VOTRE NIVEAU</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WHATSAPP BOT ── */}
        {page==="whatsapp" && (
          <div style={{maxWidth:440,margin:"0 auto"}}>
            <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,marginBottom:20,textAlign:"center"}}>📱 WHATSAPP BOT</h2>
            <div style={{background:"#111",borderRadius:24,overflow:"hidden",boxShadow:"0 30px 80px rgba(0,0,0,0.6)"}}>
              <div style={{background:"#075E54",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${B},#4da3e8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✦</div>
                <div>
                  <div style={{fontSize:13,fontWeight:"bold",color:"#fff"}}>Alamin Travel</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>🟢 En ligne</div>
                </div>
              </div>
              <div style={{background:"#0d1117",height:360,overflowY:"auto",padding:"10px",display:"flex",flexDirection:"column",gap:6}}>
                {botMessages.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"82%",padding:"8px 12px",borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="user"?"#005C4B":"#202C33",fontSize:12,color:"#e9edef",lineHeight:1.6,whiteSpace:"pre-line"}}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#111b21",padding:"6px 8px",display:"flex",gap:5,overflowX:"auto"}}>
                {["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"].map(r=>(
                  <button key={r} onClick={()=>sendBot(r)} style={{padding:"4px 10px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:11,whiteSpace:"nowrap",fontFamily:"inherit"}}>{r}</button>
                ))}
              </div>
              <div style={{background:"#111b21",padding:"8px",display:"flex",gap:8}}>
                <input value={botInput} onChange={e=>setBotInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendBot()} placeholder="Message..." style={{flex:1,padding:"8px 12px",background:"#2a3942",border:"none",borderRadius:18,color:"#e9edef",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                <button onClick={()=>sendBot()} style={{width:32,height:32,borderRadius:"50%",background:"#00a884",border:"none",color:"#fff",cursor:"pointer",fontSize:13}}>➤</button>
              </div>
            </div>
            <div style={{marginTop:16,padding:"14px 16px",borderRadius:12,background:CARD,border:`1px solid ${BORDER}`,fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.8}}>
              ✅ Disponible 24h/24 · 7j/7<br/>
              ✅ Réponse en français et arabe<br/>
              ✅ Suivi réservation par référence<br/>
              ✅ Transfert vers agent humain<br/>
              📞 Agence: +253 77 02 07 07
            </div>
          </div>
        )}

        {/* ── ADMIN ── */}
        {page==="admin" && (
          <div>
            <h2 style={{color:B,fontWeight:"normal",letterSpacing:3,marginBottom:16}}>🔧 BACK-OFFICE ADMIN</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
              {[[reservations.length,"📋","Total résa"],[reservations.filter(r=>r.status==="confirmed"||r.status==="paid").length,"✅","Confirmées",GREEN],[reservations.filter(r=>r.status==="pending").length,"⏳","En attente",ORANGE],[`${reservations.reduce((s,r)=>s+r.prix,0).toLocaleString()}$`,"💰","Revenus",B]].map(([v,icon,l,color])=>(
                <div key={l} style={{padding:"14px",borderRadius:12,background:CARD,border:`1px solid ${BORDER}`,textAlign:"center"}}>
                  <div style={{fontSize:18}}>{icon}</div>
                  <div style={{fontSize:18,fontWeight:"bold",color:color||"#f0ebe0",margin:"4px 0"}}>{v}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",letterSpacing:1}}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {reservations.map(r=>(
                <div key={r.id} onClick={()=>setSelectedRes(selectedRes?.id===r.id?null:r)} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${selectedRes?.id===r.id?B:BORDER}`,background:selectedRes?.id===r.id?"rgba(26,110,181,0.06)":CARD,cursor:"pointer",transition:"all 0.2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:20}}>{r.type==="Vol"?"✈️":r.type.includes("Hajj")||r.type.includes("Omra")?"🕌":r.type==="Hôtel Kempinski"?"🏨":"📦"}</span>
                      <div>
                        <div style={{fontWeight:"bold",fontSize:13}}>{r.client}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{r.id} · {r.dest} · {r.date}</div>
                        {r.pnr&&<div style={{fontSize:10,color:B}}>PNR: {r.pnr}</div>}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontWeight:"bold",color:B}}>{r.prix}$</div>
                      <div style={{fontSize:11,color:STATUS_COLORS[r.status]||"rgba(255,255,255,0.4)",fontWeight:"bold"}}>{STATUS_LABELS[r.status]}</div>
                    </div>
                  </div>
                  {selectedRes?.id===r.id&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${BORDER}`,display:"flex",gap:8,flexWrap:"wrap"}}>
                      <Btn small color="green" onClick={e=>{e.stopPropagation();updateReservation(r.id,"confirmed",r.pnr);}}>✅ Confirmer</Btn>
                      <Btn small onClick={e=>{e.stopPropagation();updateReservation(r.id,"paid",r.pnr);}}>💳 Payé</Btn>
                      <button onClick={e=>{e.stopPropagation();setShowPNRModal(true);}} style={{padding:"7px 14px",background:"rgba(245,166,35,0.1)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:16,color:ORANGE,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>📋 PNR</button>
                      <button onClick={e=>{e.stopPropagation();notifyWhatsApp(`📋 ${r.id}\n${r.client}\n${r.dest}\n${r.date}\n${r.prix}$\nPNR:${r.pnr||"N/A"}`);}} style={{padding:"7px 14px",background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:16,color:"#25D366",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>📱 WA</button>
                      <button onClick={e=>{e.stopPropagation();updateReservation(r.id,"cancelled");}} style={{padding:"7px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:16,color:RED,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🚫 Annuler</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PNR Modal */}
        {showPNRModal&&selectedRes&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}}>
            <div style={{background:"#0e0c16",border:`1px solid ${B}`,borderRadius:16,padding:28,maxWidth:360,width:"100%"}}>
              <h3 style={{color:B,fontWeight:"normal",marginBottom:12}}>Ajouter PNR — {selectedRes.id}</h3>
              <input value={pnrInput} onChange={e=>setPnrInput(e.target.value)} placeholder="Ex: ABC123" style={{width:"100%",padding:"11px 14px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:"#f0ebe0",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"monospace",marginBottom:14}}/>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setShowPNRModal(false)} style={{flex:1,padding:"11px",background:"transparent",border:`1px solid ${BORDER}`,borderRadius:10,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
                <Btn onClick={()=>updateReservation(selectedRes.id,"confirmed",pnrInput)}>ENREGISTRER</Btn>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{borderTop:`1px solid rgba(26,110,181,0.1)`,padding:"10px 20px",textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:2}}>
        ALAMIN TOURISM & TRAVEL © 2026 · IATA ACCREDITED · DJIBOUTI
      </footer>

      <style>{`
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.18)}
        select option{background:#1a1025;color:#f0ebe0}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(26,110,181,0.3);border-radius:2px}
      `}</style>
    </div>
  );
}
