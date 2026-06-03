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
  { icon:"🕌", title:"Hajj & Omra", desc:"Packages complets Hajj et Omra. Accompagnement spirituel.", color:"#4527A0" },
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
  { name:"Qatar Airways", code:"QR", bg:"#5C0632", accent:"#C8A96E" },
  { name:"Ethiopian Airlines", code:"ET", bg:"#007A4D", accent:"#FFCD00" },
  { name:"Emirates", code:"EK", bg:"#CC0000", accent:"#FFFFFF" },
  { name:"flydubai", code:"FZ", bg:"#E3000F", accent:"#FFFFFF" },
  { name:"flynas", code:"XY", bg:"#FF6B00", accent:"#FFFFFF" },
];

// ── COMPOSANT LOGO ────────────────────────────────────────────────────────────
const Logo = ({ size = 52, light = true }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
    <svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gL1" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#6ec6f5"/>
          <stop offset="40%" stopColor="#2a8fd4"/>
          <stop offset="100%" stopColor="#0a3d7a"/>
        </radialGradient>
        <radialGradient id="gL2" cx="30%" cy="25%" r="45%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="27" cy="27" r="25" fill="url(#gL1)"/>
      <path d="M10,18 Q16,14 22,17 Q24,22 20,26 Q14,28 10,24Z" fill="#0a4a8a" opacity="0.7"/>
      <path d="M13,28 Q18,26 21,31 Q22,37 18,41 Q13,42 11,36Z" fill="#0a4a8a" opacity="0.65"/>
      <path d="M24,14 Q30,12 34,15 Q36,20 32,23 Q26,24 23,20Z" fill="#0a4a8a" opacity="0.65"/>
      <path d="M28,22 Q35,20 38,26 Q40,33 36,38 Q30,40 26,35 Q24,28 28,22Z" fill="#0a4a8a" opacity="0.7"/>
      <path d="M34,13 Q42,11 46,17 Q48,23 44,27 Q38,28 34,22Z" fill="#0a4a8a" opacity="0.6"/>
      <ellipse cx="27" cy="27" rx="25" ry="7" fill="none" stroke="white" strokeWidth="0.5" opacity="0.25"/>
      <line x1="2" y1="27" x2="52" y2="27" stroke="white" strokeWidth="0.5" opacity="0.25"/>
      <circle cx="27" cy="27" r="25" fill="url(#gL2)"/>
      <g transform="translate(28,6) rotate(-35)">
        <ellipse cx="9" cy="3" rx="9" ry="2.8" fill="#0d2d6e"/>
        <polygon points="3,3.5 14,3.5 11,8 0,8" fill="#0d2d6e"/>
      </g>
    </svg>
    <div>
      <div style={{ fontSize: size*0.33, fontWeight:900, color: light ? "#fff" : T.navy, letterSpacing:2, lineHeight:1, fontFamily:"Georgia, serif" }}>ALAMIN</div>
      <div style={{ fontSize: size*0.13, fontWeight:600, color: light ? T.sky : T.blueL, letterSpacing:3, marginTop:1 }}>TOURISM & TRAVEL</div>
    </div>
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
`;

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPALE
// ══════════════════════════════════════════════════════════════════════════════
export default function AlaminLanding() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");

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
          <div style={{ display:"flex", gap:32, alignItems:"center" }}>
            {[["accueil","Accueil"],["services","Services"],["destinations","Djibouti"],["packages","Packages"],["agence","Contact"]].map(([id,label])=>(
              <button key={id} className="nav-link" onClick={()=>scrollTo(id)} style={{
                background:"none", border:"none", cursor:"pointer",
                color: activeSection===id ? T.sky : "rgba(255,255,255,0.8)",
                fontFamily:"inherit", fontSize:14, fontWeight:500, letterSpacing:0.5,
                transition:"color 0.2s", padding:"4px 0",
                borderBottom: activeSection===id ? `2px solid ${T.sky}` : "2px solid transparent",
              }}>{label}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
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
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="accueil" style={{ position:"relative", height:"100vh", minHeight:700, overflow:"hidden" }}>
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
        <div style={{ position:"relative", zIndex:2, maxWidth:1200, margin:"0 auto", padding:"0 40px", height:"100%", display:"flex", alignItems:"center" }}>
          <div style={{ maxWidth:680 }}>
            {/* Badge */}
            <div className="fade-up" style={{ animationDelay:"0.1s", display:"inline-flex", alignItems:"center", gap:8, background:"rgba(245,166,35,0.15)", border:"1px solid rgba(245,166,35,0.4)", borderRadius:30, padding:"6px 16px", marginBottom:24 }}>
              <span style={{ fontSize:10 }}>⭐</span>
              <span style={{ color:T.gold, fontSize:12, fontWeight:600, letterSpacing:2 }}>AGENT IATA ACCRÉDITÉ · DEPUIS 2010</span>
            </div>

            <h1 className="fade-up" style={{ animationDelay:"0.2s", fontFamily:"'Playfair Display', serif", fontSize:68, fontWeight:900, color:"#fff", lineHeight:1.05, marginBottom:24 }}>
              Votre Voyage<br/>
              <span style={{ color:T.sky }}>Commence</span><br/>
              à Djibouti
            </h1>

            <p className="fade-up" style={{ animationDelay:"0.3s", fontSize:18, color:"rgba(255,255,255,0.75)", lineHeight:1.7, marginBottom:40, maxWidth:520 }}>
              Vols internationaux, hôtels, Hajj & Omra, packages touristiques. 
              Service personnalisé depuis plus de 15 ans.
            </p>

            <div className="fade-up" style={{ animationDelay:"0.4s", display:"flex", gap:16, flexWrap:"wrap" }}>
              <button className="btn-primary" onClick={()=>scrollTo("packages")} style={{
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
            <div className="fade-up" style={{ animationDelay:"0.5s", display:"flex", gap:40, marginTop:52, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
              {STATS.slice(0,3).map(s=>(
                <div key={s.label}>
                  <div style={{ fontSize:28, fontWeight:900, color:T.sky, fontFamily:"'Playfair Display', serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte contact flottante */}
          <div className="fade-up" style={{ animationDelay:"0.6s", marginLeft:"auto", background:"rgba(255,255,255,0.07)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:28, minWidth:260 }}>
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

      {/* ══ CAROUSEL COMPAGNIES ══ */}
      <div style={{ background:T.navy, padding:"16px 0", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:`linear-gradient(to right,${T.navy},transparent)`, zIndex:2 }}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:`linear-gradient(to left,${T.navy},transparent)`, zIndex:2 }}/>
        <div className="al-track">
          {[...AIRLINES, ...AIRLINES].map((a, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginRight:40, flexShrink:0 }}>
              <div style={{ width:40, height:40, borderRadius:8, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:a.accent, fontWeight:900, fontSize:13 }}>{a.code}</span>
              </div>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, whiteSpace:"nowrap" }}>{a.name}</span>
              <span style={{ color:"rgba(255,255,255,0.2)", fontSize:20, marginLeft:10 }}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section id="services" style={{ padding:"96px 40px", background:T.gray50 }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"inline-block", background:`${T.blue}15`, color:T.blue, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>NOS SERVICES</div>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy, marginBottom:16 }}>
              Tout ce dont vous<br/>avez besoin pour voyager
            </h2>
            <p style={{ fontSize:16, color:T.gray500, maxWidth:500, margin:"0 auto", lineHeight:1.7 }}>
              De la réservation de vols à l'assistance visa, nous gérons chaque détail de votre voyage.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
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
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
            <div>
              <div style={{ display:"inline-block", background:`${T.gold}15`, color:T.goldD, fontSize:11, fontWeight:700, letterSpacing:3, padding:"6px 16px", borderRadius:30, marginBottom:16 }}>TOURISME LOCAL</div>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy }}>
                Découvrez<br/><span style={{ color:T.blue }}>Djibouti</span>
              </h2>
            </div>
            <p style={{ fontSize:15, color:T.gray500, maxWidth:340, textAlign:"right", lineHeight:1.7 }}>
              Des paysages d'une beauté rare. Djibouti, carrefour entre mer Rouge et golfe d'Aden.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"240px 240px", gap:16 }}>
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
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:"white", marginBottom:16 }}>Nos Meilleures Offres</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", maxWidth:500, margin:"0 auto" }}>Packages complets incluant vols, hébergement et accompagnement</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[
              { name:"Hajj Premium 2026", price:"810 000", duration:"21 jours", places:"30 places", tag:"POPULAIRE", img:"https://images.unsplash.com/photo-1591604328740-f52fc7af0f76?w=600&q=80", tagColor:T.gold },
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
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy }}>Ce que disent nos clients</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}>
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
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:T.navy }}>Visitez-nous à Djibouti</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }}>
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

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
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
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:46, fontWeight:700, color:"white", marginBottom:16 }}>
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
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
            <div>
              <Logo size={48} light />
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:16, lineHeight:1.8, maxWidth:280 }}>
                Votre partenaire de voyage de confiance à Djibouti depuis 2010. Agent IATA accrédité, spécialisé dans les vols internationaux, hôtels et packages Hajj & Omra.
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
              {["Billets d'avion","Hôtels","Hajj & Omra","Location voiture","Assistance visa","Voyages organisés"].map(s=>(
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
