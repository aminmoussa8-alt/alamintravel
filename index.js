import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: 0, title: "Page d'accueil", desc: "Le client arrive sur alamintravel-dj.com", screen: "hero" },
  { id: 1, title: "Choix expérience", desc: "Il sélectionne 'Requins Baleines' — 85$", screen: "experiences" },
  { id: 2, title: "Sélection vol", desc: "Ethiopian Airlines direct — 420$", screen: "vols" },
  { id: 3, title: "Choix hôtel", desc: "Kempinski Palace 5★ — 280$/nuit", screen: "hotels" },
  { id: 4, title: "Infos client", desc: "Nom, email, date, voyageurs", screen: "form" },
  { id: 5, title: "Mode de paiement", desc: "3 options disponibles", screen: "payment_choice" },
  { id: 6, title: "Payer par carte", desc: "Carte bancaire sécurisée SSL", screen: "payment_card" },
  { id: 7, title: "Payer plus tard", desc: "Réservation maintenue 48h", screen: "payment_later" },
  { id: 8, title: "Payer à l'agence", desc: "Adresse + carte + horaires", screen: "payment_agency" },
  { id: 9, title: "Confirmation", desc: "Référence + documents PDF", screen: "confirm" },
];

const B = "#1a6eb5", BD = "#0f52a0", BG = "#050e1f";
const CARD = "rgba(255,255,255,0.04)", BORDER = "rgba(26,110,181,0.2)";

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const progressRef = useRef(null);
  const STEP_DURATION = 4500;

  useEffect(() => {
    if (playing) {
      setProgress(0);
      progressRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(progressRef.current);
            setCurrentStep(s => {
              if (s < STEPS.length - 1) return s + 1;
              setPlaying(false);
              return s;
            });
            return 0;
          }
          return p + (100 / (STEP_DURATION / 100));
        });
      }, 100);
    } else {
      clearInterval(progressRef.current);
    }
    return () => clearInterval(progressRef.current);
  }, [playing, currentStep]);

  useEffect(() => {
    const s = STEPS[currentStep].screen;
    setTyped(""); setShowCursor(false);
    if (s === "form") {
      setShowCursor(true);
      let i = 0; const text = "Mohamed Ali";
      const t = setInterval(() => { if (i < text.length) setTyped(text.slice(0, ++i)); else clearInterval(t); }, 130);
      return () => clearInterval(t);
    }
    if (s === "payment_card") {
      setShowCursor(true);
      let i = 0; const text = "4242424242424242";
      const t = setInterval(() => { if (i < text.length) setTyped(text.slice(0, ++i)); else clearInterval(t); }, 80);
      return () => clearInterval(t);
    }
  }, [currentStep]);

  useEffect(() => {
    setHighlight(null);
    const t = setTimeout(() => setHighlight(STEPS[currentStep].screen), 500);
    return () => clearTimeout(t);
  }, [currentStep]);

  const step = STEPS[currentStep];

  const Screen = () => {
    const s = step.screen;

    const navBar = () => (
      <div style={{ background: "rgba(5,14,31,0.95)", borderBottom: `1px solid ${BORDER}`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 2, color: "#4da3e8" }}>ALAMIN TOURISM & TRAVEL</div>
        <div style={{ fontSize: 9, color: "rgba(26,110,181,0.5)" }}>IATA ✦</div>
      </div>
    );

    // Progress bar for steps 1+
    const progressSteps = () => (
      <div style={{ display: "flex", gap: 3, padding: "8px 16px", background: "rgba(26,110,181,0.05)" }}>
        {["Sélection","Infos","Paiement","Docs"].map((l, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: "100%", height: 2, borderRadius: 1, background: currentStep > i + 1 ? B : currentStep === i + 1 ? "rgba(26,110,181,0.4)" : "rgba(255,255,255,0.07)" }} />
            <div style={{ fontSize: 7, color: currentStep > i + 1 ? B : "rgba(255,255,255,0.2)", letterSpacing: 0.5 }}>{l.toUpperCase()}</div>
          </div>
        ))}
      </div>
    );

    if (s === "hero") return (
      <div style={{ height: "100%", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,14,31,0.4) 0%, rgba(5,14,31,0.85) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(5,14,31,0.8), transparent)" }}>
          <div style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 2, color: "#4da3e8" }}>ALAMIN TOURISM & TRAVEL</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", padding: "2px 8px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10 }}>IATA</div>
        </div>
        <div style={{ position: "absolute", bottom: "18%", left: "8%", animation: "fadeUp 0.8s ease" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#4da3e8", marginBottom: 6 }}>NATURE · DJIBOUTI</div>
          <div style={{ fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 6, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Lac Assal</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Point le plus bas d'Afrique · −155m</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ padding: "8px 18px", background: `linear-gradient(135deg, ${B}, ${BD})`, borderRadius: 20, color: "#fff", fontSize: 10, fontWeight: "bold", letterSpacing: 1, boxShadow: highlight === "hero" ? `0 0 16px rgba(26,110,181,0.6)` : "none", animation: highlight === "hero" ? "pulse 1s infinite" : "none" }}>DÉCOUVRIR →</div>
            <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, color: "#fff", fontSize: 10 }}>RÉSERVER</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "8%", right: "8%", display: "flex", gap: 5 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: i===0?20:6, height: 6, borderRadius: 3, background: i===0 ? B : "rgba(255,255,255,0.3)" }} />)}
        </div>
      </div>
    );

    if (s === "experiences") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        <div style={{ padding: "12px 14px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "#4da3e8", letterSpacing: 2, marginBottom: 8 }}>🌊 EXPÉRIENCES DJIBOUTI</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { emoji: "🦈", title: "Requins Baleines", prix: "85$", selected: highlight === s },
              { emoji: "🧂", title: "Lac Assal", prix: "65$", selected: false },
              { emoji: "🏔️", title: "Forêt du Day", prix: "75$", selected: false },
              { emoji: "🌋", title: "Lac Abbé", prix: "95$", selected: false },
            ].map((e, i) => (
              <div key={i} style={{ padding: "10px", borderRadius: 10, border: `1px solid ${e.selected ? B : "rgba(255,255,255,0.06)"}`, background: e.selected ? "rgba(26,110,181,0.1)" : CARD, position: "relative", transition: "all 0.4s", boxShadow: e.selected ? `0 0 12px rgba(26,110,181,0.3)` : "none", animation: e.selected ? "selectBounce 0.4s ease" : "none" }}>
                {e.selected && <div style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: "bold" }}>✓</div>}
                <div style={{ fontSize: 20, marginBottom: 4 }}>{e.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: "bold", color: "#f0ebe0", marginBottom: 2 }}>{e.title}</div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: B }}>{e.prix}</div>
              </div>
            ))}
          </div>
          {highlight === s && (
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(26,110,181,0.12)", border: `1px solid ${B}`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeUp 0.4s ease" }}>
              <span style={{ fontSize: 10, color: "#4da3e8" }}>🦈 Sélectionné</span>
              <div style={{ padding: "5px 12px", background: `linear-gradient(135deg, ${B}, ${BD})`, borderRadius: 12, color: "#fff", fontSize: 9, fontWeight: "bold" }}>CONTINUER →</div>
            </div>
          )}
        </div>
      </div>
    );

    if (s === "vols") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        <div style={{ padding: "12px 14px", flex: 1 }}>
          <div style={{ fontSize: 9, color: "#4da3e8", letterSpacing: 2, marginBottom: 8 }}>✈️ VOLS · DJE → PARIS</div>
          {[
            { airline: "Ethiopian Airlines", prix: "420$", escales: "Direct", selected: highlight === s },
            { airline: "Turkish Airlines", prix: "380$", escales: "1 escale", selected: false },
            { airline: "Air France", prix: "510$", escales: "1 escale", selected: false },
          ].map((v, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${v.selected ? B : "rgba(255,255,255,0.06)"}`, background: v.selected ? "rgba(26,110,181,0.08)" : CARD, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.4s", boxShadow: v.selected ? `0 0 12px rgba(26,110,181,0.25)` : "none" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: "bold", color: "#f0ebe0" }}>{v.airline}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{v.escales}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 16, fontWeight: "bold", color: B }}>{v.prix}</div>
                {v.selected && <div style={{ width: 18, height: 18, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff" }}>✓</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (s === "hotels") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        <div style={{ padding: "12px 14px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "#4da3e8", letterSpacing: 2, marginBottom: 8 }}>🏨 HÔTELS · DJIBOUTI</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { name: "Kempinski Palace", stars: 5, prix: "280$", selected: highlight === s, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=70" },
              { name: "Sheraton Djibouti", stars: 5, prix: "210$", selected: false, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&q=70" },
              { name: "Le Méridien", stars: 4, prix: "145$", selected: false, img: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=200&q=70" },
              { name: "Transithotel", stars: 3, prix: "85$", selected: false, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&q=70" },
            ].map((h, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${h.selected ? B : "rgba(255,255,255,0.06)"}`, transition: "all 0.4s", boxShadow: h.selected ? `0 0 12px rgba(26,110,181,0.3)` : "none" }}>
                <div style={{ position: "relative", height: 55 }}>
                  <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {h.selected && <div style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff" }}>✓</div>}
                </div>
                <div style={{ padding: "6px 8px", background: h.selected ? "rgba(26,110,181,0.08)" : CARD }}>
                  <div style={{ fontSize: 9, fontWeight: "bold", color: "#f0ebe0", marginBottom: 1 }}>{h.name}</div>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: B }}>{h.prix}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    if (s === "form") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        {progressSteps()}
        <div style={{ padding: "12px 14px", flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: "bold", color: "#4da3e8", marginBottom: 12 }}>Vos Informations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            {[
              { label: "PRÉNOM", val: typed, typing: true },
              { label: "NOM", val: "Hassan" },
              { label: "EMAIL", val: "m.ali@gmail.com" },
              { label: "TÉL", val: "+253 77..." },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ fontSize: 7, letterSpacing: 1, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>{f.label}</div>
                <div style={{ padding: "7px 8px", background: CARD, border: `1px solid ${i === 0 && highlight === s ? B : BORDER}`, borderRadius: 7, fontSize: 10, color: "#f0ebe0", minHeight: 26, display: "flex", alignItems: "center" }}>
                  {f.typing ? typed : f.val}
                  {f.typing && highlight === s && showCursor && <span style={{ borderRight: `1.5px solid ${B}`, animation: "blink 1s infinite", marginLeft: 1 }}>&nbsp;</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 7, letterSpacing: 1, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>DATE</div>
              <div style={{ padding: "7px 8px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 10, color: "#f0ebe0" }}>15/07/2026</div>
            </div>
            <div>
              <div style={{ fontSize: 7, letterSpacing: 1, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>VOYAGEURS</div>
              <div style={{ padding: "7px 8px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 10, color: "#f0ebe0" }}>2 personnes</div>
            </div>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(26,110,181,0.06)", border: `1px solid ${BORDER}` }}>
            {[["🦈 Requins Baleines ×2","170$"],["✈️ Ethiopian Airlines ×2","840$"],["🏨 Kempinski ×3n","840$"]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 3 }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{l}</span><span style={{ color: B }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 5, paddingTop: 5, display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 11 }}>
              <span>TOTAL</span><span style={{ color: B }}>1 850$</span>
            </div>
          </div>
        </div>
      </div>
    );

    if (s === "payment_choice") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        {progressSteps()}
        <div style={{ padding: "12px 14px", flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: "bold", color: "#4da3e8", marginBottom: 4 }}>Mode de Paiement</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Choisissez votre option</div>
          <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(26,110,181,0.06)", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Total à régler</span>
            <span style={{ fontSize: 16, fontWeight: "bold", color: B }}>1 850$</span>
          </div>
          {[
            { icon: "💳", label: "Payer par carte", sub: "Visa, Mastercard — SSL", color: B, active: false },
            { icon: "⏰", label: "Payer plus tard", sub: "Réservation maintenue 48h", color: "#f5a623", active: highlight === s },
            { icon: "🏢", label: "Payer à l'agence", sub: "Espèces ou chèque", color: "#22c55e", active: false },
          ].map((opt, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${opt.active ? opt.color : "rgba(255,255,255,0.06)"}`, background: opt.active ? `rgba(${opt.color === B ? "26,110,181" : opt.color === "#f5a623" ? "245,166,35" : "34,197,94"},0.08)` : CARD, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.4s", boxShadow: opt.active ? `0 0 10px rgba(0,0,0,0.3)` : "none", animation: opt.active ? "selectBounce 0.4s ease" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: opt.active ? opt.color : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.3s" }}>{opt.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: "bold", color: "#f0ebe0" }}>{opt.label}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{opt.sub}</div>
                </div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${opt.active ? opt.color : "rgba(255,255,255,0.2)"}`, background: opt.active ? opt.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", transition: "all 0.3s" }}>{opt.active ? "✓" : ""}</div>
            </div>
          ))}
        </div>
      </div>
    );

    if (s === "payment_card") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        {progressSteps()}
        <div style={{ padding: "12px 14px", flex: 1 }}>
          <div style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid rgba(26,110,181,0.2)`, background: "rgba(26,110,181,0.05)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${B}, ${BD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💳</div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: B }}>Paiement par carte sélectionné</div>
          </div>
          <div style={{ height: 90, borderRadius: 12, background: "linear-gradient(135deg, #0d1a2e, #1a2a4a)", border: "1px solid rgba(26,110,181,0.2)", padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 7, letterSpacing: 2, color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>ALAMIN TRAVEL CARD</div>
            <div style={{ fontSize: 13, letterSpacing: 2, color: "#f0ebe0", marginBottom: 10, fontFamily: "monospace" }}>
              {typed ? typed.replace(/(.{4})/g,"$1 ").trim() : "•••• •••• •••• ••••"}
              {highlight === s && showCursor && typed.length < 16 && <span style={{ animation: "blink 1s infinite", borderRight: `1.5px solid ${B}` }}>&nbsp;</span>}
            </div>
            <div style={{ fontSize: 10, color: "#f0ebe0" }}>MOHAMED ALI</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[["NUMÉRO DE CARTE", typed ? typed.replace(/(.{4})/g,"$1 ").trim() : "4242 4242 4242 4242"], ["EXPIRATION", "07/28"], ["CVV", "•••"]].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontSize: 7, letterSpacing: 1, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>{l}</div>
                <div style={{ padding: "7px 8px", background: CARD, border: `1px solid ${l.includes("CARTE") && highlight === s ? B : BORDER}`, borderRadius: 7, fontSize: 10, color: "#f0ebe0", fontFamily: "monospace" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "9px 12px", background: `linear-gradient(135deg, ${B}, ${BD})`, borderRadius: 22, textAlign: "center", color: "#fff", fontSize: 11, fontWeight: "bold", letterSpacing: 1, animation: highlight === s && typed.length >= 14 ? "pulse 1s infinite" : "none" }}>
            🔒 CONFIRMER 1 850$
          </div>
        </div>
      </div>
    );

    if (s === "payment_later") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        {progressSteps()}
        <div style={{ padding: "12px 14px", flex: 1 }}>
          <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.07)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #f5a623, #e8870a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⏰</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: "bold", color: "#f5a623" }}>Payer plus tard</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Réservation maintenue 48h</div>
            </div>
          </div>
          {[["📱 Mobile Money", "D-Money, Waafi Pay"],["🏦 Virement bancaire", "IBAN DJ21 0001..."],["💵 Virement Western Union", "Ref. dossier requis"]].map(([l,v]) => (
            <div key={l} style={{ padding: "9px 12px", borderRadius: 9, background: CARD, border: `1px solid rgba(245,166,35,0.15)`, marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "#f0ebe0" }}>{l}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{v}</div>
            </div>
          ))}
          <div style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", marginTop: 4 }}>
            <div style={{ fontSize: 9, color: "#f5a623", fontWeight: "bold", marginBottom: 4 }}>⚠️ IMPORTANT</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Votre réservation est bloquée <strong style={{ color: "#f0ebe0" }}>48 heures</strong>. Passé ce délai, elle sera automatiquement annulée.</div>
          </div>
          <div style={{ marginTop: 12, padding: "9px 12px", background: "linear-gradient(135deg, #f5a623, #e8870a)", borderRadius: 22, textAlign: "center", color: "#fff", fontSize: 11, fontWeight: "bold", letterSpacing: 1, animation: highlight === s ? "pulse 1s infinite" : "none" }}>
            ⏰ RÉSERVER — PAYER SOUS 48H
          </div>
        </div>
      </div>
    );

    if (s === "payment_agency") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        {progressSteps()}
        <div style={{ padding: "12px 14px", flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.07)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏢</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: "bold", color: "#22c55e" }}>Payer à l'agence</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Espèces ou chèque</div>
            </div>
          </div>
          {/* Mini map */}
          <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 10, height: 90, background: "linear-gradient(135deg, #0d2a1a, #1a3a2a)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34,197,94,0.2)", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1524813686514-a57563d77965?w=400&q=50)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.3 }} />
            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{ fontSize: 24, animation: highlight === s ? "bounce 1s infinite" : "none" }}>📍</div>
              <div style={{ fontSize: 9, color: "#22c55e", fontWeight: "bold" }}>Salines Ouest, Djibouti</div>
            </div>
          </div>
          {[
            ["📍", "Salines Ouest, Mohamed Kamil Road"],
            ["🕐", "Lun–Sam : 08h–18h  |  Dim : 09h–13h"],
            ["📞", "+253 21 25 07 17"],
            ["📱", "+253 77 64 64 05 / 77 64 64 06"],
          ].map(([icon, val]) => (
            <div key={val} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 10px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 13 }}>{icon}</span>
              <span style={{ fontSize: 9, color: "#f0ebe0", lineHeight: 1.4 }}>{val}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "9px 12px", background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 22, textAlign: "center", color: "#fff", fontSize: 11, fontWeight: "bold", letterSpacing: 1, animation: highlight === s ? "pulse 1s infinite" : "none" }}>
            🏢 RÉSERVER — PAYER À L'AGENCE
          </div>
        </div>
      </div>
    );

    if (s === "confirm") return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {navBar()}
        <div style={{ padding: "16px 14px", flex: 1, textAlign: "center", overflowY: "auto" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${B}, ${BD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 10px", boxShadow: `0 0 24px rgba(26,110,181,0.5)`, animation: highlight === s ? "popIn 0.5s ease" : "none" }}>✓</div>
          <div style={{ fontSize: 15, fontWeight: "bold", color: "#4da3e8", marginBottom: 4 }}>Réservation Confirmée !</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Merci Mohamed Ali</div>
          <div style={{ fontSize: 13, fontWeight: "bold", color: B, letterSpacing: 2, marginBottom: 4 }}>AT-K8X2P9</div>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 12, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", fontSize: 9, color: "#f5a623", marginBottom: 12 }}>⏰ Paiement attendu sous 48h</div>
          <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(26,110,181,0.06)", border: `1px solid ${BORDER}`, textAlign: "left", marginBottom: 10 }}>
            {[["🦈 Requins Baleines","170$"],["✈️ Ethiopian Airlines","840$"],["🏨 Kempinski ×3n","840$"]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 4 }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{l}</span><span style={{ color: B }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 5, paddingTop: 5, display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 11 }}>
              <span>TOTAL</span><span style={{ color: B }}>1 850$</span>
            </div>
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>📄 TÉLÉCHARGER VOS DOCUMENTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[["✅","Confirmation"],["🧾","Facture"],["🏨","Bon Hôtel"],["✈️","Itinéraire"]].map(([icon,label]) => (
              <div key={label} style={{ padding: "8px 6px", background: "rgba(26,110,181,0.08)", border: `1px solid ${BORDER}`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{icon}</div>
                <div style={{ fontSize: 8, color: "#f0ebe0", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 7, color: B }}>⬇ PDF</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return null;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030a18", fontFamily: "'Georgia', serif", color: "#f0ebe0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: B, marginBottom: 5 }}>DÉMONSTRATION INTERACTIVE</div>
        <h1 style={{ fontSize: 20, fontWeight: "normal", letterSpacing: 3, margin: "0 0 4px", color: "#4da3e8" }}>ALAMIN TOURISM & TRAVEL</h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>Parcours client complet — 10 étapes</p>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", maxWidth: 900, width: "100%", flexWrap: "wrap", justifyContent: "center" }}>

        {/* Phone mockup */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ width: 260, background: "#080d1a", borderRadius: 30, padding: "10px 6px", border: "2px solid rgba(26,110,181,0.25)", boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(26,110,181,0.08)`, position: "relative" }}>
            <div style={{ width: 70, height: 5, background: "#1a2535", borderRadius: 3, margin: "0 auto 8px" }} />
            <div style={{ background: BG, borderRadius: 18, height: 470, overflow: "hidden", position: "relative" }}>
              <Screen />
              {playing && (
                <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1 }}>
                  <div style={{ height: "100%", background: `linear-gradient(90deg, ${B}, #4da3e8)`, borderRadius: 1, width: `${progress}%`, transition: "width 0.1s linear" }} />
                </div>
              )}
            </div>
            <div style={{ width: 50, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "8px auto 0" }} />
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, minWidth: 240, maxWidth: 380 }}>
          {/* Step info */}
          <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(26,110,181,0.07)", border: `1px solid ${BORDER}`, marginBottom: 14, animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: B, marginBottom: 4 }}>ÉTAPE {currentStep + 1} / {STEPS.length}</div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: "#f0ebe0", marginBottom: 3 }}>{step.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{step.desc}</div>
          </div>

          {/* Steps list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16, maxHeight: 320, overflowY: "auto" }}>
            {STEPS.map((s, i) => (
              <div key={i} onClick={() => { setCurrentStep(i); setPlaying(false); setProgress(0); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, border: `1px solid ${i === currentStep ? B : "rgba(255,255,255,0.04)"}`, background: i === currentStep ? "rgba(26,110,181,0.1)" : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < currentStep ? `linear-gradient(135deg, ${B}, ${BD})` : i === currentStep ? "rgba(26,110,181,0.3)" : "rgba(255,255,255,0.04)", border: `1px solid ${i <= currentStep ? B : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: i < currentStep ? "#fff" : i === currentStep ? B : "rgba(255,255,255,0.25)", fontWeight: "bold", flexShrink: 0 }}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: i === currentStep ? "#f0ebe0" : "rgba(255,255,255,0.35)", fontWeight: i === currentStep ? "bold" : "normal" }}>{s.title}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => { setPlaying(!playing); }} style={{ flex: 2, padding: "11px", background: playing ? "rgba(26,110,181,0.15)" : `linear-gradient(135deg, ${B}, ${BD})`, border: playing ? `1px solid ${B}` : "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: "bold", letterSpacing: 1, fontFamily: "inherit", boxShadow: !playing ? `0 4px 16px rgba(26,110,181,0.3)` : "none" }}>
              {playing ? "⏸ PAUSE" : currentStep >= STEPS.length - 1 ? "🔄 REJOUER" : "▶ LECTURE AUTO"}
            </button>
            <button onClick={() => { setCurrentStep(s => Math.max(0, s-1)); setPlaying(false); setProgress(0); }} disabled={currentStep === 0} style={{ flex: 1, padding: "11px", background: CARD, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: currentStep === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)", cursor: currentStep === 0 ? "not-allowed" : "pointer", fontSize: 12, fontFamily: "inherit" }}>←</button>
            <button onClick={() => { setCurrentStep(s => Math.min(STEPS.length-1, s+1)); setPlaying(false); setProgress(0); }} disabled={currentStep === STEPS.length - 1} style={{ flex: 1, padding: "11px", background: CARD, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: currentStep === STEPS.length-1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)", cursor: currentStep === STEPS.length-1 ? "not-allowed" : "pointer", fontSize: 12, fontFamily: "inherit" }}>→</button>
          </div>

          {/* IATA badge */}
          <div style={{ padding: "10px 14px", borderRadius: 10, background: CARD, border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 18 }}>🏆</div>
            <div>
              <div style={{ fontSize: 10, color: B, fontWeight: "bold" }}>IATA ACCREDITED AGENT</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Alamin Tourism & Travel · Djibouti</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 8px rgba(26,110,181,0.3)} 50%{box-shadow:0 0 20px rgba(26,110,181,0.7)} }
        @keyframes selectBounce { 0%{transform:scale(1)} 50%{transform:scale(1.02)} 100%{transform:scale(1)} }
        @keyframes popIn { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:rgba(26,110,181,0.3)}
      `}</style>
    </div>
  );
}
