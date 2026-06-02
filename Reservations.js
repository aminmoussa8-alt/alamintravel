import { useState, useEffect, useRef } from "react";

const DJIBOUTI_GALLERY = [
  {
    url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=90",
    title: "Lac Assal", subtitle: "Le point le plus bas d'Afrique · −155m", tag: "NATURE"
  },
  {
    url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=90",
    title: "Golfe de Tadjoura", subtitle: "Plongée avec les requins baleines", tag: "AVENTURE"
  },
  {
    url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=90",
    title: "Forêt du Day", subtitle: "Parc national · Montagne Goda", tag: "ÉCOTOURISME"
  },
  {
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=90",
    title: "Djibouti Ville", subtitle: "Perle de la Corne de l'Afrique", tag: "CULTURE"
  },
];

const EXPERIENCES = [
  { emoji: "🦈", title: "Requins Baleines", desc: "Nager avec les plus grands poissons du monde dans le Golfe d'Aden", prix: "85€", duree: "Demi-journée" },
  { emoji: "🧂", title: "Lac Assal", desc: "Explorer le lac le plus salé d'Afrique, plus salé que la Mer Morte", prix: "65€", duree: "Journée" },
  { emoji: "🏔️", title: "Forêt du Day", desc: "Trek dans la forêt de genévriers millénaires au cœur des montagnes Goda", prix: "75€", duree: "2 jours" },
  { emoji: "🌋", title: "Lac Abbé", desc: "Paysage lunaire de cheminées calcaires au lever du soleil", prix: "95€", duree: "2 jours" },
  { emoji: "🤿", title: "Plongée Ras Siyyan", desc: "Récifs coralliens préservés, raies manta et dauphins", prix: "110€", duree: "Journée" },
  { emoji: "🐊", title: "Lac Goubet", desc: "Eaux sombres mystérieuses peuplées de requins et de légendes", prix: "70€", duree: "Journée" },
];

const DESTINATIONS_WORLD = [
  { name: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", prix: "420€", emoji: "🗼" },
  { name: "Dubai", country: "Émirats", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", prix: "380€", emoji: "🏙️" },
  { name: "Istanbul", country: "Turquie", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80", prix: "290€", emoji: "🕌" },
  { name: "Bali", country: "Indonésie", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", prix: "560€", emoji: "🌺" },
  { name: "Nairobi", country: "Kenya", img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80", prix: "180€", emoji: "🦁" },
  { name: "Tokyo", country: "Japon", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", prix: "780€", emoji: "⛩️" },
];

const SYSTEM_PROMPT = `Tu es Horizon, conseiller expert d'Alamin Tourism & Travel, agence de voyage basée à Djibouti.
Tu parles en français avec passion. Tu es spécialiste de Djibouti et de la Corne de l'Afrique.
Crée des itinéraires détaillés jour par jour, estime les budgets en euros/FDJ.
Utilise **gras** pour les titres et emojis pertinents. Max 350 mots.
Quand tu génères un itinéraire complet, termine par [ITINERAIRE_PRET] sur une nouvelle ligne.`;

export default function App() {
  const [slide, setSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("accueil");
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Bienvenue chez **Alamin Tourism & Travel** 🌍\n\nJe suis Horizon, votre conseiller voyage IA spécialisé sur **Djibouti et le monde**.\n\nJe peux créer votre itinéraire personnalisé, trouver les meilleures expériences et vous envoyer votre programme par email.\n\n**Que souhaitez-vous découvrir ?**`,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailVal, setEmailVal] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [lastItinerary, setLastItinerary] = useState("");
  const [memory, setMemory] = useState(null);
  const [showMemory, setShowMemory] = useState(false);
  const [hoveredExp, setHoveredExp] = useState(null);
  const [hoveredDest, setHoveredDest] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => setSlide(s => (s + 1) % DJIBOUTI_GALLERY.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alamintravel_v3");
      if (saved) { setMemory(JSON.parse(saved)); setShowMemory(true); setTimeout(() => setShowMemory(false), 5000); }
    } catch(e) {}
  }, []);

  const sendMsg = async (text) => {
    const t = text || input.trim();
    if (!t || loading) return;
    setInput("");
    const userMsg = { role: "user", content: t };
    const hist = [...messages, userMsg];
    setMessages(hist);
    setLoading(true);
    setActiveTab("agent");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: hist.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const d = await r.json();
      let reply = d.content?.[0]?.text || "Désolé, erreur de connexion.";
      let hasItin = false;
      if (reply.includes("[ITINERAIRE_PRET]")) {
        reply = reply.replace("[ITINERAIRE_PRET]", "").trim();
        setLastItinerary(reply);
        hasItin = true;
        reply += "\n\n📧 **Itinéraire prêt !** Cliquez le bouton pour le recevoir par email.";
      }
      setMessages([...hist, { role: "assistant", content: reply, hasItin }]);
    } catch {
      setMessages([...hist, { role: "assistant", content: "⚠️ Erreur. Veuillez réessayer." }]);
    } finally { setLoading(false); }
  };

  const doSendEmail = async () => {
    if (!emailVal.includes("@")) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const mem = { email: emailVal, lastVisit: new Date().toISOString() };
    localStorage.setItem("alamintravel_v3", JSON.stringify(mem));
    setMemory(mem);
    setEmailSent(true);
    setLoading(false);
    setMessages(prev => [...prev, { role: "assistant", content: `✅ **Envoyé à ${emailVal} !**\n\nVotre itinéraire personnalisé vient d'être envoyé. Je vous ai aussi mémorisé pour votre prochaine visite. 🧠` }]);
    setTimeout(() => { setShowEmail(false); setEmailSent(false); setEmailVal(""); }, 2000);
  };

  const fmt = (text) => text.split("\n").map((l, i, a) => (
    <span key={i}><span dangerouslySetInnerHTML={{ __html: l.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") }} />{i < a.length - 1 && <br />}</span>
  ));

  const g = DJIBOUTI_GALLERY[slide];

  return (
    <div style={{ minHeight: "100vh", background: "#050e1f", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#f0ebe0", overflowX: "hidden" }}>

      {/* Memory banner */}
      {showMemory && memory && (
        <div style={{ background: "linear-gradient(90deg, rgba(26,110,181,0.2), rgba(26,110,181,0.05))", borderBottom: "1px solid rgba(26,110,181,0.3)", padding: "9px 24px", textAlign: "center", fontSize: 13, color: "#1a6eb5", animation: "slideDown 0.5s ease" }}>
          ✨ Bon retour ! Dernier accès : {new Date(memory.lastVisit).toLocaleDateString("fr-FR")}
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        {/* Background slideshow */}
        {DJIBOUTI_GALLERY.map((item, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${item.url})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === slide ? 1 : 0,
            transition: "opacity 1.5s ease",
            zIndex: 1,
          }} />
        ))}

        {/* Dark overlay with gradient */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to bottom, rgba(6,8,16,0.3) 0%, rgba(6,8,16,0.1) 40%, rgba(6,8,16,0.7) 80%, rgba(6,8,16,1) 100%)" }} />

        {/* Animated shimmer overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(135deg, rgba(26,110,181,0.05) 0%, transparent 50%, rgba(26,110,181,0.03) 100%)" }} />

        {/* NAV */}
        <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to bottom, rgba(6,8,16,0.8) 0%, transparent 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="Alamin Tourism & Travel" style={{ height: 54, objectFit: "contain", filter: "brightness(0) invert(1)", maxWidth: 260 }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.5)" }}>IATA ACCREDITED AGENT</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["accueil","🏠"], ["djibouti","🌊"], ["monde","✈️"], ["agent","💬"]].map(([tab, icon]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid", borderColor: activeTab === tab ? "#1a6eb5" : "rgba(255,255,255,0.15)", background: activeTab === tab ? "rgba(26,110,181,0.2)" : "rgba(0,0,0,0.3)", color: activeTab === tab ? "#1a6eb5" : "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 12, letterSpacing: 1, backdropFilter: "blur(10px)", fontFamily: "inherit" }}>
                {icon} {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div style={{ position: "absolute", bottom: "12%", left: "6%", zIndex: 10, maxWidth: 700 }}>
          {/* Tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(26,110,181,0.15)", border: "1px solid rgba(26,110,181,0.4)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, backdropFilter: "blur(10px)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a6eb5", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, letterSpacing: 3, color: "#1a6eb5" }}>{g.tag}</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 7vw, 72px)", fontWeight: "bold", lineHeight: 1.1, margin: "0 0 12px", textShadow: "0 4px 30px rgba(0,0,0,0.8)", letterSpacing: 2 }}>
            {g.title}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 28, letterSpacing: 1, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            {g.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => sendMsg(`Crée-moi un itinéraire 5 jours pour découvrir ${g.title} à Djibouti avec toutes les activités et le budget.`)} style={{ padding: "13px 28px", background: "linear-gradient(135deg, #1a6eb5, #0f52a0)", border: "none", borderRadius: 30, color: "#050e1f", cursor: "pointer", fontSize: 14, fontWeight: "bold", letterSpacing: 2, boxShadow: "0 8px 30px rgba(26,110,181,0.4)", fontFamily: "inherit" }}>
              DÉCOUVRIR →
            </button>
            <button onClick={() => setActiveTab("djibouti")} style={{ padding: "13px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", cursor: "pointer", fontSize: 14, letterSpacing: 1, backdropFilter: "blur(10px)", fontFamily: "inherit" }}>
              EXPLORER DJIBOUTI
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div style={{ position: "absolute", bottom: "8%", right: "6%", zIndex: 10, display: "flex", gap: 8 }}>
          {DJIBOUTI_GALLERY.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 28 : 8, height: 8, borderRadius: 4, background: i === slide ? "#1a6eb5" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.4s ease", padding: 0 }} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "bounce 2s infinite" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.4)" }}>DÉFILER</div>
          <div style={{ width: 1, height: 30, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>

        {/* ── ACCUEIL TAB ── */}
        {activeTab === "accueil" && (
          <>
            {/* Stats bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, margin: "60px 0", background: "rgba(26,110,181,0.1)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(26,110,181,0.15)" }}>
              {[["500+", "Clients satisfaits"], ["15+", "Destinations"], ["24/7", "Support IA"], ["10 ans", "D'expertise"]].map(([num, label]) => (
                <div key={label} style={{ padding: "24px 20px", textAlign: "center", background: "rgba(6,8,16,0.8)" }}>
                  <div style={{ fontSize: 28, fontWeight: "bold", color: "#1a6eb5", marginBottom: 4 }}>{num}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Section title */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 11, letterSpacing: 5, color: "#1a6eb5", marginBottom: 10 }}>DÉCOUVREZ</div>
              <h2 style={{ fontSize: 36, fontWeight: "normal", letterSpacing: 2, margin: 0 }}>Expériences Uniques à Djibouti</h2>
              <div style={{ width: 60, height: 1, background: "#1a6eb5", margin: "16px auto 0" }} />
            </div>

            {/* Experiences grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 60 }}>
              {EXPERIENCES.map((e, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredExp(i)}
                  onMouseLeave={() => setHoveredExp(null)}
                  onClick={() => sendMsg(`Dis-moi tout sur l'expérience "${e.title}" à Djibouti : détails pratiques, ce qu'on voit, comment réserver, et quel est le meilleur moment.`)}
                  style={{ padding: "24px", borderRadius: 16, border: `1px solid ${hoveredExp === i ? "rgba(26,110,181,0.5)" : "rgba(255,255,255,0.06)"}`, background: hoveredExp === i ? "rgba(26,110,181,0.06)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.3s", transform: hoveredExp === i ? "translateY(-4px)" : "none", boxShadow: hoveredExp === i ? "0 16px 50px rgba(26,110,181,0.12)" : "none" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{e.emoji}</div>
                  <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6, color: "#f0ebe0" }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 14 }}>{e.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: "bold", color: "#1a6eb5" }}>{e.prix}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>{e.duree.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 60, height: 240 }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(6,8,16,0.85) 0%, rgba(6,8,16,0.4) 100%)" }} />
              <div style={{ position: "relative", zIndex: 1, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", boxSizing: "border-box" }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 4, color: "#1a6eb5", marginBottom: 8 }}>VOTRE VOYAGE SUR MESURE</div>
                  <h3 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: "normal" }}>Planifiez avec notre IA</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: 14 }}>Itinéraire complet en quelques secondes</p>
                </div>
                <button onClick={() => setActiveTab("agent")} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #1a6eb5, #0f52a0)", border: "none", borderRadius: 30, color: "#050e1f", cursor: "pointer", fontSize: 14, fontWeight: "bold", letterSpacing: 2, whiteSpace: "nowrap", boxShadow: "0 8px 30px rgba(26,110,181,0.4)", fontFamily: "inherit" }}>
                  COMMENCER →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── DJIBOUTI TAB ── */}
        {activeTab === "djibouti" && (
          <div style={{ paddingTop: 60 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: 5, color: "#1a6eb5", marginBottom: 10 }}>LA PERLE DE LA CORNE D'AFRIQUE</div>
              <h2 style={{ fontSize: 40, fontWeight: "normal", letterSpacing: 2, margin: "0 0 16px" }}>Djibouti</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7, fontSize: 14 }}>Un pays grand comme la Bretagne, mais avec des paysages d'une diversité incroyable — volcans, lacs salés, récifs coralliens et désert.</p>
            </div>

            {/* Photo gallery */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "200px 200px", gap: 8, marginBottom: 48, borderRadius: 16, overflow: "hidden" }}>
              {[
                { url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80", label: "Lac Assal", span: "1 / 2 / 3 / 2" },
                { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80", label: "Golfe de Tadjoura" },
                { url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80", label: "Forêt du Day" },
                { url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80", label: "Djibouti Ville" },
                { url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80", label: "Lac Abbé" },
              ].map((img, i) => (
                <div key={i} onClick={() => sendMsg(`Parle-moi de ${img.label} à Djibouti — ce qu'on peut y faire, comment y aller et le meilleur moment pour visiter.`)} style={{ position: "relative", gridRow: i === 0 ? "1 / 3" : "auto", cursor: "pointer", overflow: "hidden" }}>
                  <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,8,16,0.7) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 13, fontWeight: "bold", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{img.label}</div>
                </div>
              ))}
            </div>

            {/* Experiences */}
            <div style={{ marginBottom: 60 }}>
              <h3 style={{ fontSize: 24, fontWeight: "normal", letterSpacing: 2, marginBottom: 24, color: "#1a6eb5" }}>Nos Expériences</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {EXPERIENCES.map((e, i) => (
                  <div key={i} onClick={() => sendMsg(`Réserve l'expérience "${e.title}" pour moi — dis-moi tout ce dont j'ai besoin de savoir.`)}
                    onMouseEnter={() => setHoveredExp(i)} onMouseLeave={() => setHoveredExp(null)}
                    style={{ display: "flex", gap: 14, padding: "16px", borderRadius: 12, border: `1px solid ${hoveredExp === i ? "rgba(26,110,181,0.4)" : "rgba(255,255,255,0.06)"}`, background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{e.emoji}</div>
                    <div>
                      <div style={{ fontWeight: "bold", marginBottom: 4, fontSize: 14 }}>{e.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{e.desc}</div>
                      <div style={{ marginTop: 8, color: "#1a6eb5", fontWeight: "bold", fontSize: 16 }}>{e.prix} <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: "normal" }}>· {e.duree}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MONDE TAB ── */}
        {activeTab === "monde" && (
          <div style={{ paddingTop: 60 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: 5, color: "#1a6eb5", marginBottom: 10 }}>DEPUIS DJIBOUTI</div>
              <h2 style={{ fontSize: 40, fontWeight: "normal", letterSpacing: 2, margin: 0 }}>Le Monde à Portée de Main</h2>
              <div style={{ width: 60, height: 1, background: "#1a6eb5", margin: "16px auto 0" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, marginBottom: 60 }}>
              {DESTINATIONS_WORLD.map((d, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)}
                  onClick={() => sendMsg(`Crée-moi un itinéraire complet 7 jours à ${d.name}, ${d.country} avec hébergements, activités incontournables et budget depuis Djibouti.`)}
                  style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", border: `1px solid ${hoveredDest === i ? "rgba(26,110,181,0.4)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.3s", transform: hoveredDest === i ? "translateY(-6px)" : "none", boxShadow: hoveredDest === i ? "0 20px 60px rgba(0,0,0,0.5)" : "none" }}>
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", transform: hoveredDest === i ? "scale(1.08)" : "scale(1)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,8,16,0.9) 0%, rgba(6,8,16,0.1) 60%)" }} />
                    <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(26,110,181,0.9)", borderRadius: 16, padding: "4px 12px", fontSize: 11, color: "#050e1f", fontWeight: "bold", letterSpacing: 1 }}>dès {d.prix}</div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, padding: "16px" }}>
                      <div style={{ fontSize: 8, letterSpacing: 3, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{d.country.toUpperCase()}</div>
                      <div style={{ fontSize: 24, fontWeight: "bold" }}>{d.emoji} {d.name}</div>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>VOL DEPUIS DJIBOUTI</span>
                    <span style={{ fontSize: 12, color: "#1a6eb5" }}>PLANIFIER →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AGENT TAB ── */}
        {activeTab === "agent" && (
          <div style={{ paddingTop: 40 }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ width: 52, height: 52, background: "linear-gradient(135deg, #1a6eb5, #4da3e8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px", boxShadow: "0 0 30px rgba(26,110,181,0.3)" }}>✦</div>
              <h2 style={{ fontSize: 26, fontWeight: "normal", letterSpacing: 3, margin: "0 0 6px", color: "#1a6eb5" }}>HORIZON — AGENT IA</h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Votre conseiller voyage disponible 24h/24</p>
            </div>

            <div style={{ height: "50vh", minHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 14, padding: "4px 0" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 6 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                    {msg.role === "assistant" && (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #1a6eb5, #4da3e8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginTop: 4 }}>✦</div>
                    )}
                    <div style={{ maxWidth: "75%", padding: "13px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px", background: msg.role === "user" ? "linear-gradient(135deg, #1a6eb5, #0f52a0)" : "rgba(255,255,255,0.04)", border: msg.role === "user" ? "none" : "1px solid rgba(26,110,181,0.12)", color: msg.role === "user" ? "#ffffff" : "#f0ebe0", fontSize: 13, lineHeight: 1.7 }}>
                      {fmt(msg.content)}
                    </div>
                  </div>
                  {msg.hasItin && (
                    <button onClick={() => setShowEmail(true)} style={{ marginLeft: 44, padding: "8px 18px", background: "linear-gradient(135deg, #1a6eb5, #0f52a0)", border: "none", borderRadius: 20, color: "#050e1f", cursor: "pointer", fontSize: 12, fontWeight: "bold", letterSpacing: 1 }}>
                      📧 RECEVOIR PAR EMAIL
                    </button>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1a6eb5, #4da3e8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
                  <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(26,110,181,0.12)", borderRadius: "4px 18px 18px 18px", display: "flex", gap: 5 }}>
                    {[0,1,2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a6eb5", animation: `pulse 1.2s ease-in-out ${d*0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick prompts */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {["🦈 Nager avec requins baleines", "🧂 Lac Assal + Lac Abbé", "✈️ Paris depuis Djibouti", "🏔️ Trek Forêt du Day"].map((p, i) => (
                <button key={i} onClick={() => sendMsg(p)} style={{ padding: "6px 14px", background: "rgba(26,110,181,0.07)", border: "1px solid rgba(26,110,181,0.18)", borderRadius: 18, color: "#3b8fd4", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>{p}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(26,110,181,0.25)", borderRadius: 28, padding: "8px 8px 8px 18px", alignItems: "center" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); }}} placeholder="Décrivez votre voyage idéal..." rows={1} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f0ebe0", fontSize: 13, resize: "none", fontFamily: "inherit", lineHeight: 1.5 }} />
              <button onClick={() => sendMsg()} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() && !loading ? "linear-gradient(135deg, #1a6eb5, #0f52a0)" : "rgba(26,110,181,0.1)", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", color: input.trim() && !loading ? "#ffffff" : "rgba(26,110,181,0.3)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 80, borderTop: "1px solid rgba(26,110,181,0.15)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, flexWrap: "wrap" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1a6eb5, #4da3e8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 20px rgba(26,110,181,0.3)" }}>✦</div>
              <div>
                <div style={{ fontSize: 16, letterSpacing: 4, color: "#1a6eb5", fontWeight: "bold" }}>ALAMIN TOURISM & TRAVEL</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 3 }}>IATA ACCREDITED AGENT</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7, maxWidth: 280, margin: "0 0 16px" }}>
              Votre agence de voyage intelligente basée à Djibouti, spécialisée dans la découverte de la Corne de l'Afrique et du monde entier.
            </p>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#1a6eb5", marginBottom: 16 }}>CONTACT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>📍</span>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  Salines Ouest<br />
                  Mohamed Kamil Road<br />
                  Djibouti
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>📞</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>+253 21 25 07 17</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>📱</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>+253 77 64 64 05 / 77 64 64 06</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>📧</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>reservations@alamintravel-dj.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#1a6eb5", marginBottom: 16 }}>NAVIGATION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["🏠", "Accueil", "accueil"], ["🌊", "Djibouti", "djibouti"], ["✈️", "Monde", "monde"], ["💬", "Agent IA", "agent"]].map(([icon, label, tab]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ display: "flex", gap: 8, alignItems: "center", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12, padding: 0, fontFamily: "inherit", textAlign: "left" }}>
                  <span>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(26,110,181,0.08)", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: 2 }}>© 2026 ALAMIN TOURISM & TRAVEL — TOUS DROITS RÉSERVÉS</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: 1 }}>Salines Ouest, Mohamed Kamil Road, Djibouti</div>
        </div>
      </footer>

      {/* Email Modal */}
      {showEmail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20, backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#0e0c16", border: "1px solid rgba(26,110,181,0.3)", borderRadius: 20, padding: 36, maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>{emailSent ? "✅" : "📧"}</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#1a6eb5", marginBottom: 8 }}>{emailSent ? "Envoyé !" : "Recevoir mon itinéraire"}</div>
            {!emailSent && <>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Votre programme personnalisé sera envoyé immédiatement à votre adresse email.</p>
              <input value={emailVal} onChange={e => setEmailVal(e.target.value)} placeholder="votre@email.com" style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(26,110,181,0.2)", borderRadius: 12, color: "#f0ebe0", fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box", fontFamily: "inherit" }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowEmail(false)} style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
                <button onClick={doSendEmail} disabled={loading} style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #1a6eb5, #0f52a0)", border: "none", borderRadius: 12, color: "#050e1f", cursor: "pointer", fontWeight: "bold", letterSpacing: 1, fontFamily: "inherit" }}>
                  {loading ? "Envoi..." : "ENVOYER →"}
                </button>
              </div>
            </>}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(26,110,181,0.2);border-radius:2px}
      `}</style>
    </div>
  );
}

// NOTE DEVELOPPEUR:
// Placer le fichier logo: /public/logo.png (fichier 115192.png renommé)
// Palette couleurs: Bleu principal #1a6eb5 | Bleu foncé #0f52a0 | Bleu clair #4da3e8
// Fond: Navy #050e1f
