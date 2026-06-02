import { useState } from "react";
import jsPDF from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";

const EXPERIENCES = [
  { id: 1, emoji: "🦈", title: "Requins Baleines", lieu: "Golfe d'Aden", prix: 85, duree: "Demi-journée", places: 8, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", desc: "Nager avec les plus grands poissons du monde" },
  { id: 2, emoji: "🧂", title: "Lac Assal", lieu: "Région Tadjoura", prix: 65, duree: "Journée", places: 12, img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80", desc: "Le lac le plus salé d'Afrique, −155m" },
  { id: 3, emoji: "🏔️", title: "Forêt du Day", lieu: "Montagnes Goda", prix: 75, duree: "2 jours", places: 6, img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80", desc: "Trek dans les genévriers millénaires" },
  { id: 4, emoji: "🌋", title: "Lac Abbé", lieu: "Triangle Afar", prix: 95, duree: "2 jours", places: 10, img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80", desc: "Cheminées calcaires au lever du soleil" },
  { id: 5, emoji: "🤿", title: "Plongée Ras Siyyan", lieu: "Mer Rouge", prix: 110, duree: "Journée", places: 8, img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80", desc: "Récifs coralliens, raies manta, dauphins" },
  { id: 6, emoji: "🐊", title: "Lac Goubet", lieu: "Golfe de Tadjoura", prix: 70, duree: "Journée", places: 15, img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80", desc: "Eaux mystérieuses et paysages volcaniques" },
];

const VOLS = [
  { id: 1, airline: "Ethiopian Airlines", logo: "✈️", depart: "08:00", arrivee: "14:30", escales: "Direct", duree: "6h30", prix: 420, dest: "Paris CDG", classe: "Économique" },
  { id: 2, airline: "Air France", logo: "🇫🇷", depart: "11:45", arrivee: "20:15", escales: "1 escale", duree: "8h30", prix: 510, dest: "Paris CDG", classe: "Économique" },
  { id: 3, airline: "Turkish Airlines", logo: "🇹🇷", depart: "23:30", arrivee: "13:45+1", escales: "1 escale", duree: "14h15", prix: 380, dest: "Paris CDG", classe: "Économique" },
  { id: 4, airline: "Emirates", logo: "🇦🇪", depart: "14:00", arrivee: "08:30+1", escales: "1 escale", duree: "18h30", prix: 650, dest: "Paris CDG", classe: "Business" },
  { id: 5, airline: "Kenya Airways", logo: "🦁", depart: "06:15", arrivee: "18:00", escales: "1 escale", duree: "11h45", prix: 340, dest: "Paris CDG", classe: "Économique" },
];

const HOTELS = [
  { id: 1, name: "Kempinski Palace Djibouti", stars: 5, prix: 280, note: 4.8, avis: 1240, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", amenities: ["Piscine", "Spa", "Restaurant", "WiFi", "Plage privée"] },
  { id: 2, name: "Sheraton Djibouti Hotel", stars: 5, prix: 210, note: 4.6, avis: 876, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", amenities: ["Piscine", "Restaurant", "WiFi", "Vue mer"] },
  { id: 3, name: "Hotel Le Meridien", stars: 4, prix: 145, note: 4.4, avis: 654, img: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80", amenities: ["Restaurant", "WiFi", "Bar", "Parking"] },
  { id: 4, name: "Transithotel Djibouti", stars: 3, prix: 85, note: 4.1, avis: 423, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", amenities: ["WiFi", "Restaurant", "Climatisation"] },
  { id: 5, name: "Djibouti Palace Kempinski", stars: 5, prix: 320, note: 4.9, avis: 987, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", amenities: ["Piscine infinity", "Spa", "Plage", "WiFi", "Concierge"] },
  { id: 6, name: "Auberge de la Plage", stars: 3, prix: 60, note: 3.9, avis: 210, img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80", amenities: ["WiFi", "Petit-dejeuner", "Vue mer"] },
];

const B = "#1a6eb5";
const BD = "#0f52a0";
const BG = "#050e1f";
const CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(26,110,181,0.2)";

// ── PDF Generator ─────────────────────────────────────────────────────────────
function generatePDF(type, data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const today = new Date().toLocaleDateString("fr-FR");
  const ref = data.ref;

  const titles = {
    confirmation: "CONFIRMATION DE RESERVATION",
    facture: "FACTURE",
    hotel: "BON DE RESERVATION HOTEL",
    itineraire: "ITINERAIRE DE VOYAGE",
  };

  // Header background
  doc.setFillColor(5, 14, 31);
  doc.rect(0, 0, W, 28, "F");
  doc.setFillColor(26, 110, 181);
  doc.rect(0, 28, W, 2, "F");

  // Brand name
  doc.setTextColor(77, 163, 232);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("ALAMIN TOURISM & TRAVEL", 15, 12);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(138, 180, 212);
  doc.text("WHERE EVERY DREAM TAKES FLIGHT  |  IATA ACCREDITED AGENT", 15, 17);

  // Document title right
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(titles[type], W - 15, 12, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(138, 180, 212);
  doc.text(`Ref: ${ref}  |  Date: ${today}`, W - 15, 17, { align: "right" });

  // Footer
  doc.setFillColor(5, 14, 31);
  doc.rect(0, H - 14, W, 14, "F");
  doc.setFillColor(26, 110, 181);
  doc.rect(0, H - 14, W, 1, "F");
  doc.setTextColor(138, 180, 212);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Salines Ouest, Mohamed Kamil Road, Djibouti", 15, H - 9);
  doc.text("Tel: +253 21 25 07 17  |  Mobile: +253 77 64 64 05 / 77 64 64 06", 15, H - 5);
  doc.text("reservations@alamintravel-dj.com", W - 15, H - 9, { align: "right" });
  doc.text("www.alamintravel-dj.com", W - 15, H - 5, { align: "right" });

  let y = 35;

  const sectionHeader = (text) => {
    doc.setFillColor(26, 110, 181);
    doc.rect(15, y, 180, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`  ${text}`, 17, y + 5);
    y += 10;
  };

  const infoRow = (label, value, highlight = false) => {
    doc.setFillColor(245, 247, 250);
    doc.rect(15, y, 180, 7, "F");
    doc.setDrawColor(208, 223, 240);
    doc.line(15, y + 7, 195, y + 7);
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label, 17, y + 5);
    if (highlight) {
      doc.setTextColor(26, 138, 74);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(5, 14, 31);
      doc.setFont("helvetica", "bold");
    }
    doc.text(value, 65, y + 5);
    y += 8;
  };

  // ── CONFIRMATION ──────────────────────────────────────────────────────────
  if (type === "confirmation") {
    doc.setFillColor(26, 138, 74);
    doc.rect(15, y, 180, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("  RESERVATION CONFIRMEE", 17, y + 6.5);
    y += 13;

    sectionHeader("INFORMATIONS CLIENT");
    infoRow("Reference :", ref);
    infoRow("Client :", `${data.prenom} ${data.nom}`);
    infoRow("Email :", data.email);
    infoRow("Telephone :", data.tel);
    infoRow("Date de reservation :", today);
    infoRow("Statut :", "CONFIRME", true);
    y += 4;

    sectionHeader("PRESTATIONS RESERVEES");
    if (data.exp) infoRow("Experience :", `${data.exp.emoji} ${data.exp.title} x${data.voyageurs} — ${data.exp.prix * data.voyageurs} USD`);
    if (data.vol) infoRow("Vol :", `${data.vol.airline} ${data.vol.depart}->${data.vol.arrivee} x${data.voyageurs} — ${data.vol.prix * data.voyageurs} USD`);
    if (data.hotel) infoRow("Hotel :", `${data.hotel.name} ${"★".repeat(data.hotel.stars)} x${data.nights} nuits — ${data.hotel.prix * data.nights} USD`);
    infoRow("Date de depart :", data.date);
    infoRow("Voyageurs :", `${data.voyageurs} personne${data.voyageurs > 1 ? "s" : ""}`);
    y += 4;

    sectionHeader("RECAPITULATIF FINANCIER");
    if (data.exp) infoRow("Experience :", `${data.exp.prix * data.voyageurs} USD`);
    if (data.vol) infoRow("Vol :", `${data.vol.prix * data.voyageurs} USD`);
    if (data.hotel) infoRow("Hotel :", `${data.hotel.prix * data.nights} USD`);
    y += 2;
    doc.setFillColor(232, 241, 251);
    doc.rect(15, y, 180, 9, "F");
    doc.setDrawColor(26, 110, 181);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    doc.setTextColor(26, 110, 181);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TTC :", 130, y + 6.5, { align: "right" });
    doc.text(`${data.total} USD`, 193, y + 6.5, { align: "right" });
  }

  // ── FACTURE ───────────────────────────────────────────────────────────────
  if (type === "facture") {
    sectionHeader("FACTURE AU NOM DE");
    infoRow("Client :", `${data.prenom} ${data.nom}`);
    infoRow("Email :", data.email);
    infoRow("Telephone :", data.tel);
    infoRow("Reference dossier :", ref);
    infoRow("Date emission :", today);
    y += 4;

    sectionHeader("DETAIL DES PRESTATIONS");
    const headers = ["Designation", "Qte", "P.U.", "Total"];
    const colX = [17, 120, 145, 168];
    doc.setFillColor(15, 82, 160);
    doc.rect(15, y, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    headers.forEach((h, i) => doc.text(h, colX[i], y + 5.5));
    y += 9;

    const items = [];
    if (data.exp) items.push([`${data.exp.emoji} ${data.exp.title}`, `${data.voyageurs} pax`, `${data.exp.prix} USD`, `${data.exp.prix * data.voyageurs} USD`]);
    if (data.vol) items.push([`Vol ${data.vol.airline}`, `${data.voyageurs} pax`, `${data.vol.prix} USD`, `${data.vol.prix * data.voyageurs} USD`]);
    if (data.hotel) items.push([`${data.hotel.name} x${data.nights}n`, "1", `${data.hotel.prix * data.nights} USD`, `${data.hotel.prix * data.nights} USD`]);

    items.forEach((row, i) => {
      doc.setFillColor(i % 2 === 0 ? 255 : 245, i % 2 === 0 ? 255 : 247, i % 2 === 0 ? 255 : 250);
      doc.rect(15, y, 180, 7, "F");
      doc.setDrawColor(208, 223, 240);
      doc.rect(15, y, 180, 7, "S");
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      row.forEach((cell, j) => doc.text(String(cell), colX[j], y + 5));
      y += 8;
    });

    y += 3;
    const subtotal = Math.round(data.total / 1.1);
    const tva = data.total - subtotal;
    [["Sous-total HT :", `${subtotal} USD`], ["TVA (10%) :", `${tva} USD`]].forEach(([l, v]) => {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(l, 140, y); doc.text(v, 193, y, { align: "right" }); y += 6;
    });
    doc.setFillColor(232, 241, 251);
    doc.rect(15, y, 180, 9, "F");
    doc.setDrawColor(26, 110, 181);
    doc.setLineWidth(1);
    doc.line(15, y, 195, y);
    doc.setTextColor(26, 110, 181);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TTC :", 140, y + 6.5);
    doc.text(`${data.total} USD`, 193, y + 6.5, { align: "right" });
    y += 14;

    sectionHeader("MODALITES DE PAIEMENT");
    ["Virement bancaire : IBAN DJ21 0001 0000 0000 1234 5678 900",
     "Paiement en ligne : www.alamintravel-dj.com/paiement",
     "Paiement en especes a l'agence : Salines Ouest, Djibouti"].forEach(line => {
      doc.setFillColor(245, 247, 250);
      doc.rect(15, y, 180, 7, "F");
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`• ${line}`, 17, y + 5);
      y += 8;
    });
  }

  // ── HOTEL ─────────────────────────────────────────────────────────────────
  if (type === "hotel" && data.hotel) {
    doc.setFillColor(26, 138, 74);
    doc.rect(15, y, 180, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("  RESERVATION HOTEL CONFIRMEE", 17, y + 6.5);
    y += 13;

    doc.setFillColor(232, 241, 251);
    doc.rect(15, y, 180, 14, "F");
    doc.setDrawColor(26, 110, 181);
    doc.setLineWidth(2);
    doc.line(15, y + 14, 195, y + 14);
    doc.setTextColor(15, 82, 160);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`${data.hotel.name}`, 17, y + 7);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`${"★".repeat(data.hotel.stars)}  |  Djibouti Ville, Djibouti`, 17, y + 12);
    y += 18;

    sectionHeader("DETAILS DU SEJOUR");
    infoRow("Reference :", ref);
    infoRow("Client :", `${data.prenom} ${data.nom}`);
    infoRow("Email :", data.email);
    infoRow("Check-in :", data.date ? `${data.date} apres 14h00` : "A confirmer");
    infoRow("Duree :", `${data.nights} nuit${data.nights > 1 ? "s" : ""}`);
    infoRow("Chambre :", "Chambre Deluxe — 2 adultes");
    infoRow("Petit-dejeuner :", "Inclus — buffet international");
    infoRow("Statut :", "CONFIRME — Garantie par carte", true);
    y += 4;

    sectionHeader("TARIFICATION");
    infoRow("Prix par nuit :", `${data.hotel.prix} USD`);
    infoRow("Nombre de nuits :", `${data.nights}`);
    infoRow("Sous-total :", `${data.hotel.prix * data.nights} USD`);
    infoRow("Taxes (5%) :", `${Math.round(data.hotel.prix * data.nights * 0.05)} USD`);
    y += 2;
    doc.setFillColor(232, 241, 251);
    doc.rect(15, y, 180, 9, "F");
    doc.setDrawColor(26, 110, 181);
    doc.setLineWidth(1);
    doc.line(15, y, 195, y);
    doc.setTextColor(26, 110, 181);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL SEJOUR :", 130, y + 6.5, { align: "right" });
    doc.text(`${Math.round(data.hotel.prix * data.nights * 1.05)} USD`, 193, y + 6.5, { align: "right" });
    y += 14;

    sectionHeader("CONDITIONS D'ANNULATION");
    infoRow("Annulation gratuite :", "30 jours avant arrivee");
    infoRow("Annulation tardive :", "1 nuit facturee");
    infoRow("Non-presentation :", "Totalite du sejour facturee");
  }

  // ── ITINERAIRE ────────────────────────────────────────────────────────────
  if (type === "itineraire") {
    sectionHeader("INFORMATIONS DU VOYAGE");
    infoRow("Reference :", ref);
    infoRow("Client :", `${data.prenom} ${data.nom}`);
    infoRow("Date de depart :", data.date || "A confirmer");
    infoRow("Voyageurs :", `${data.voyageurs} personne${data.voyageurs > 1 ? "s" : ""}`);
    y += 4;

    if (data.vol) {
      sectionHeader("VOL");
      infoRow("Compagnie :", data.vol.airline);
      infoRow("Depart :", `${data.vol.depart} — Djibouti (DJE)`);
      infoRow("Arrivee :", `${data.vol.arrivee} — ${data.vol.dest}`);
      infoRow("Duree :", data.vol.duree);
      infoRow("Escales :", data.vol.escales);
      infoRow("Classe :", data.vol.classe);
      y += 4;
    }

    if (data.hotel) {
      sectionHeader("HEBERGEMENT");
      infoRow("Hotel :", `${data.hotel.name} ${"★".repeat(data.hotel.stars)}`);
      infoRow("Duree :", `${data.nights} nuit${data.nights > 1 ? "s" : ""}`);
      infoRow("Services :", data.hotel.amenities.join(", "));
      y += 4;
    }

    if (data.exp) {
      sectionHeader("EXPERIENCE");
      infoRow("Activite :", `${data.exp.emoji} ${data.exp.title}`);
      infoRow("Lieu :", data.exp.lieu);
      infoRow("Duree :", data.exp.duree);
      infoRow("Participants :", `${data.voyageurs} personne${data.voyageurs > 1 ? "s" : ""}`);
      y += 4;
    }

    sectionHeader("INFORMATIONS PRATIQUES");
    ["Passeport valide 6 mois apres le retour obligatoire",
     "Assurance voyage recommandee",
     "Devise locale : Franc Djiboutien (FDJ)",
     "Heure locale : UTC+3",
     "Contact urgence agence : +253 77 64 64 05"].forEach(info => {
      doc.setFillColor(245, 247, 250);
      doc.rect(15, y, 180, 7, "F");
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`• ${info}`, 17, y + 5);
      y += 8;
    });
  }

  return doc;
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Reservations() {
  const [tab, setTab] = useState("experiences");
  const [selectedExp, setSelectedExp] = useState(null);
  const [selectedVol, setSelectedVol] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", tel: "", date: "", voyageurs: "1", notes: "" });
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", nom: "" });
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [nights, setNights] = useState(3);
  const [docsGenerated, setDocsGenerated] = useState(false);
  const [payMode, setPayMode] = useState(null); // "card" | "later" | "agency"

  const totalExp = selectedExp ? selectedExp.prix * parseInt(form.voyageurs || 1) : 0;
  const totalVol = selectedVol ? selectedVol.prix * parseInt(form.voyageurs || 1) : 0;
  const totalHotel = selectedHotel ? selectedHotel.prix * nights : 0;
  const total = totalExp + totalVol + totalHotel;

  const getPDFData = (bookingRef) => ({
    ref: bookingRef,
    prenom: form.prenom,
    nom: form.nom,
    email: form.email,
    tel: form.tel,
    date: form.date,
    voyageurs: parseInt(form.voyageurs),
    nights,
    exp: selectedExp,
    vol: selectedVol,
    hotel: selectedHotel,
    total,
  });

  const downloadDoc = (type) => {
    const data = getPDFData(ref);
    const doc = generatePDF(type, data);
    const names = {
      confirmation: `confirmation_${ref}.pdf`,
      facture: `facture_${ref}.pdf`,
      hotel: `reservation_hotel_${ref}.pdf`,
      itineraire: `itineraire_${ref}.pdf`,
    };
    doc.save(names[type]);
  };

  const confirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      const bookingRef = "AT-" + Math.random().toString(36).substr(2, 8).toUpperCase();
      setRef(bookingRef);
      setStep(3);
      setLoading(false);
    }, 2000);
  };

  const input = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>{label.toUpperCase()}</div>
      <input type={type} value={form[key]} placeholder={placeholder} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 10, color: "#f0ebe0", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );

  const cardInput = (label, key, placeholder, maxLen) => (
    <div key={key}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>{label.toUpperCase()}</div>
      <input value={card[key]} placeholder={placeholder} maxLength={maxLen} onChange={e => setCard(p => ({ ...p, [key]: e.target.value }))}
        style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 10, color: "#f0ebe0", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Georgia', serif", color: "#f0ebe0" }}>
      {/* jsPDF CDN */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #0d1117, #1a1025, #0d1117)", borderBottom: "1px solid rgba(26,110,181,0.2)", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${B}, #4da3e8)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: `0 0 20px rgba(26,110,181,0.4)` }}>✦</div>
          <div>
            <div style={{ fontSize: 15, letterSpacing: 4, color: B, fontWeight: "bold" }}>ALAMIN TOURISM & TRAVEL</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(26,110,181,0.5)" }}>RÉSERVATIONS EN LIGNE</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>📞 +253 21 25 07 17</div>
      </header>

      {/* Progress */}
      {step > 0 && (
        <div style={{ background: "rgba(26,110,181,0.05)", borderBottom: "1px solid rgba(26,110,181,0.1)", padding: "12px 32px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center" }}>
            {[["1","Sélection"],["2","Vos infos"],["3","Paiement"],["4","Documents"]].map(([num,label],i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? `linear-gradient(135deg, ${B}, ${BD})` : step === i ? "rgba(26,110,181,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${step >= i ? B : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: step > i ? "#fff" : step === i ? B : "rgba(255,255,255,0.3)", fontWeight: "bold" }}>
                    {step > i ? "✓" : num}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 1, color: step >= i ? B : "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>{label.toUpperCase()}</div>
                </div>
                {i < 3 && <div style={{ flex: 1, height: 1, background: step > i ? B : "rgba(255,255,255,0.08)", margin: "0 8px", marginBottom: 14 }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* STEP 0 — BROWSE */}
        {step === 0 && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid rgba(26,110,181,0.1)", paddingBottom: 16 }}>
              {[["experiences","🌊 Expériences"],["vols","✈️ Vols"],["hotels","🏨 Hôtels"]].map(([t,label]) => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 20px", borderRadius: 22, border: "1px solid", borderColor: tab === t ? B : "rgba(26,110,181,0.15)", background: tab === t ? "rgba(26,110,181,0.12)" : "transparent", color: tab === t ? B : "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, letterSpacing: 1, fontFamily: "inherit" }}>{label}</button>
              ))}
            </div>

            {tab === "experiences" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                {EXPERIENCES.map(e => (
                  <div key={e.id} onMouseEnter={() => setHovered(e.id)} onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelectedExp(selectedExp?.id === e.id ? null : e)}
                    style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${selectedExp?.id === e.id ? B : hovered === e.id ? "rgba(26,110,181,0.3)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.3s", transform: hovered === e.id ? "translateY(-4px)" : "none", boxShadow: selectedExp?.id === e.id ? `0 0 0 2px ${B}` : "none", background: selectedExp?.id === e.id ? "rgba(26,110,181,0.05)" : CARD }}>
                    <div style={{ position: "relative", height: 150 }}>
                      <img src={e.img} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,14,31,0.85) 0%, transparent 55%)" }} />
                      {selectedExp?.id === e.id && <div style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: 12 }}>✓</div>}
                      <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 10, color: "rgba(255,255,255,0.6)", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: 10 }}>{e.lieu}</div>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ fontWeight: "bold", fontSize: 14 }}>{e.emoji} {e.title}</div>
                        <div style={{ fontSize: 18, fontWeight: "bold", color: B }}>{e.prix}$</div>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{e.desc}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                        <span>⏱ {e.duree}</span><span>👥 {e.places} places max</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "vols" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {VOLS.map(v => (
                  <div key={v.id} onClick={() => setSelectedVol(selectedVol?.id === v.id ? null : v)}
                    onMouseEnter={() => setHovered(`v${v.id}`)} onMouseLeave={() => setHovered(null)}
                    style={{ padding: "18px 22px", borderRadius: 14, border: `1px solid ${selectedVol?.id === v.id ? B : hovered === `v${v.id}` ? "rgba(26,110,181,0.25)" : "rgba(255,255,255,0.06)"}`, background: selectedVol?.id === v.id ? "rgba(26,110,181,0.06)" : CARD, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, boxShadow: selectedVol?.id === v.id ? `0 0 0 1px ${B}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ fontSize: 28 }}>{v.logo}</div>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 3 }}>{v.airline}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{v.escales} · {v.duree} · {v.classe}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: "bold" }}>{v.depart} <span style={{ color: B }}>→</span> {v.arrivee}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>DJE → {v.dest}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 24, fontWeight: "bold", color: B }}>{v.prix}$</div>
                      {selectedVol?.id === v.id && <div style={{ width: 26, height: 26, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: 12 }}>✓</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "hotels" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                {HOTELS.map(h => (
                  <div key={h.id} onClick={() => setSelectedHotel(selectedHotel?.id === h.id ? null : h)}
                    onMouseEnter={() => setHovered(`h${h.id}`)} onMouseLeave={() => setHovered(null)}
                    style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${selectedHotel?.id === h.id ? B : hovered === `h${h.id}` ? "rgba(26,110,181,0.25)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.3s", transform: hovered === `h${h.id}` ? "translateY(-4px)" : "none", boxShadow: selectedHotel?.id === h.id ? `0 0 0 2px ${B}` : "none" }}>
                    <div style={{ position: "relative", height: 140 }}>
                      <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,14,31,0.8) 0%, transparent 60%)" }} />
                      {selectedHotel?.id === h.id && <div style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: 12 }}>✓</div>}
                      <div style={{ position: "absolute", bottom: 10, left: 12, color: B, fontSize: 13 }}>{"⭐".repeat(h.stars)}</div>
                    </div>
                    <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ fontWeight: "bold", fontSize: 13 }}>{h.name}</div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 18, fontWeight: "bold", color: B }}>{h.prix}$</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>/nuit</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
                        {h.amenities.slice(0,3).map(a => <span key={a} style={{ fontSize: 10, padding: "2px 8px", background: "rgba(26,110,181,0.08)", borderRadius: 10, color: "rgba(255,255,255,0.4)" }}>{a}</span>)}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>⭐ {h.note} · {h.avis} avis</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(selectedExp || selectedVol || selectedHotel) && (
              <div style={{ position: "sticky", bottom: 20, marginTop: 32, padding: "18px 24px", borderRadius: 16, background: "rgba(5,14,31,0.97)", border: `1px solid ${B}`, backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {selectedExp && <span style={{ fontSize: 13 }}>🌊 <strong style={{ color: B }}>{selectedExp.title}</strong></span>}
                  {selectedVol && <span style={{ fontSize: 13 }}>✈️ <strong style={{ color: B }}>{selectedVol.airline}</strong></span>}
                  {selectedHotel && <span style={{ fontSize: 13 }}>🏨 <strong style={{ color: B }}>{selectedHotel.name}</strong></span>}
                </div>
                <button onClick={() => setStep(1)} style={{ padding: "12px 28px", background: `linear-gradient(135deg, ${B}, ${BD})`, border: "none", borderRadius: 24, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: "bold", letterSpacing: 1, fontFamily: "inherit", boxShadow: `0 4px 20px rgba(26,110,181,0.3)` }}>CONTINUER →</button>
              </div>
            )}
          </>
        )}

        {/* STEP 1 — FORM */}
        {step === 1 && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: "normal", color: B, letterSpacing: 2, marginBottom: 24 }}>Vos Informations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {input("Prénom", "prenom", "text", "Mohamed")}
              {input("Nom", "nom", "text", "Ali")}
              {input("Email", "email", "email", "votre@email.com")}
              {input("Téléphone", "tel", "tel", "+253 77...")}
              {input("Date de départ", "date", "date")}
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>VOYAGEURS</div>
                <select value={form.voyageurs} onChange={e => setForm(p => ({ ...p, voyageurs: e.target.value }))} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 10, color: "#f0ebe0", fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} style={{ background: "#1a1025" }}>{n} voyageur{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
            </div>
            {selectedHotel && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>NUITS</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => setNights(n => Math.max(1, n-1))} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(26,110,181,0.1)", border: `1px solid ${BORDER}`, color: B, cursor: "pointer", fontSize: 18, fontFamily: "inherit" }}>−</button>
                  <span style={{ fontSize: 20, fontWeight: "bold", color: B, minWidth: 30, textAlign: "center" }}>{nights}</span>
                  <button onClick={() => setNights(n => n+1)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(26,110,181,0.1)", border: `1px solid ${BORDER}`, color: B, cursor: "pointer", fontSize: 18, fontFamily: "inherit" }}>+</button>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{nights}n × {selectedHotel.prix}$ = <strong style={{ color: B }}>{totalHotel}$</strong></span>
                </div>
              </div>
            )}
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(26,110,181,0.06)", border: `1px solid ${BORDER}`, marginBottom: 20 }}>
              {selectedExp && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span>🌊 {selectedExp.title} × {form.voyageurs}</span><span style={{ color: B }}>{totalExp}$</span></div>}
              {selectedVol && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span>✈️ {selectedVol.airline} × {form.voyageurs}</span><span style={{ color: B }}>{totalVol}$</span></div>}
              {selectedHotel && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span>🏨 {selectedHotel.name} × {nights}n</span><span style={{ color: B }}>{totalHotel}$</span></div>}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>TOTAL</span><span style={{ color: B, fontSize: 20 }}>{total}$</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>← RETOUR</button>
              <button onClick={() => setStep(2)} disabled={!form.nom || !form.prenom || !form.email || !form.date} style={{ flex: 3, padding: "13px", background: form.nom && form.prenom && form.email && form.date ? `linear-gradient(135deg, ${B}, ${BD})` : "rgba(26,110,181,0.15)", border: "none", borderRadius: 12, color: "#fff", cursor: form.nom && form.prenom && form.email && form.date ? "pointer" : "not-allowed", fontWeight: "bold", letterSpacing: 1, fontSize: 14, fontFamily: "inherit" }}>
                PROCÉDER AU PAIEMENT →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — PAYMENT */}
        {step === 2 && (
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: "normal", color: B, letterSpacing: 2, marginBottom: 6 }}>Mode de Paiement</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>Choisissez comment vous souhaitez régler votre réservation</p>

            {/* Total reminder */}
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(26,110,181,0.06)", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Total à régler</span>
              <span style={{ fontSize: 26, fontWeight: "bold", color: B }}>{total}$</span>
            </div>

            {/* 3 payment options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>

              {/* Option 1 — Carte bancaire */}
              <div style={{ borderRadius: 16, border: `1px solid ${payMode === "card" ? B : "rgba(255,255,255,0.08)"}`, background: payMode === "card" ? "rgba(26,110,181,0.08)" : CARD, overflow: "hidden", transition: "all 0.2s" }}>
                <div onClick={() => setPayMode(payMode === "card" ? null : "card")} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${B}, ${BD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💳</div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 14, color: "#f0ebe0" }}>Paiement par carte</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Visa, Mastercard — Sécurisé SSL 256-bit</div>
                    </div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${payMode === "card" ? B : "rgba(255,255,255,0.2)"}`, background: payMode === "card" ? B : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.2s" }}>{payMode === "card" ? "✓" : ""}</div>
                </div>
                {payMode === "card" && (
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{ height: 130, borderRadius: 12, background: "linear-gradient(135deg, #0d1a2e, #1a2a4a)", border: `1px solid rgba(26,110,181,0.2)`, padding: "16px 18px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -15, right: -15, width: 100, height: 100, borderRadius: "50%", background: "rgba(26,110,181,0.07)" }} />
                      <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>ALAMIN TRAVEL CARD</div>
                      <div style={{ fontSize: 15, letterSpacing: 3, color: "#f0ebe0", marginBottom: 12, fontFamily: "monospace" }}>
                        {card.num ? card.num.replace(/(.{4})/g,"$1 ").trim() : "•••• •••• •••• ••••"}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "#f0ebe0" }}>{card.nom || form.prenom + " " + form.nom}</div>
                        <div style={{ width: 32, height: 20, borderRadius: 4, background: `linear-gradient(135deg, ${B}, ${BD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: "bold" }}>✦</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {cardInput("Numéro de carte", "num", "1234 5678 9012 3456", 16)}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {cardInput("Expiration", "exp", "MM/AA", 5)}
                        {cardInput("CVV", "cvv", "123", 3)}
                      </div>
                      {cardInput("Nom sur la carte", "nom", form.prenom + " " + form.nom, 30)}
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2 — Payer plus tard */}
              <div onClick={() => setPayMode("later")} style={{ padding: "16px 20px", borderRadius: 16, border: `1px solid ${payMode === "later" ? "#f5a623" : "rgba(255,255,255,0.08)"}`, background: payMode === "later" ? "rgba(245,166,35,0.07)" : CARD, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f5a623, #e8870a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⏰</div>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 14, color: "#f0ebe0" }}>Payer plus tard</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Réservez maintenant, réglez sous 48h par virement ou mobile money</div>
                  </div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${payMode === "later" ? "#f5a623" : "rgba(255,255,255,0.2)"}`, background: payMode === "later" ? "#f5a623" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.2s" }}>{payMode === "later" ? "✓" : ""}</div>
              </div>

              {/* Option 3 — Payer à l'agence */}
              <div style={{ borderRadius: 16, border: `1px solid ${payMode === "agency" ? "#22c55e" : "rgba(255,255,255,0.08)"}`, background: payMode === "agency" ? "rgba(34,197,94,0.07)" : CARD, overflow: "hidden", transition: "all 0.2s" }}>
                <div onClick={() => setPayMode(payMode === "agency" ? null : "agency")} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 14, color: "#f0ebe0" }}>Payer à l'agence</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Espèces ou chèque — Venez nous rendre visite</div>
                    </div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${payMode === "agency" ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: payMode === "agency" ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.2s" }}>{payMode === "agency" ? "✓" : ""}</div>
                </div>
                {payMode === "agency" && (
                  <div style={{ padding: "0 20px 20px" }}>
                    {/* Map embed + address */}
                    <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 14, border: `1px solid rgba(34,197,94,0.2)` }}>
                      <iframe
                        title="Alamin Travel Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.0!2d43.145!3d11.589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSalines+Ouest%2C+Djibouti!5e0!3m2!1sfr!2sdj!4v1234567890"
                        width="100%" height="180" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        ["📍", "Adresse", "Salines Ouest, Mohamed Kamil Road, Djibouti"],
                        ["🕐", "Horaires", "Lun–Sam : 08h00 – 18h00  |  Dim : 09h00 – 13h00"],
                        ["📞", "Téléphone", "+253 21 25 07 17"],
                        ["📱", "Mobile", "+253 77 64 64 05 / 77 64 64 06"],
                        ["📧", "Email", "reservations@alamintravel-dj.com"],
                      ].map(([icon, label, val]) => (
                        <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "rgba(34,197,94,0.05)", borderRadius: 10, border: "1px solid rgba(34,197,94,0.1)" }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                          <div>
                            <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{label.toUpperCase()}</div>
                            <div style={{ fontSize: 12, color: "#f0ebe0" }}>{val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                      ⚠️ Votre réservation sera maintenue <strong style={{ color: "#f0ebe0" }}>48 heures</strong>. Merci de vous présenter à l'agence avec votre <strong style={{ color: "#f0ebe0" }}>référence de dossier</strong>.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>← RETOUR</button>
              <button onClick={confirmPayment} disabled={loading || !payMode} style={{ flex: 3, padding: "13px", background: payMode ? (payMode === "card" ? `linear-gradient(135deg, ${B}, ${BD})` : payMode === "later" ? "linear-gradient(135deg, #f5a623, #e8870a)" : "linear-gradient(135deg, #22c55e, #16a34a)") : "rgba(255,255,255,0.05)", border: "none", borderRadius: 12, color: payMode ? "#fff" : "rgba(255,255,255,0.2)", cursor: payMode ? "pointer" : "not-allowed", fontWeight: "bold", letterSpacing: 1, fontSize: 14, fontFamily: "inherit", boxShadow: payMode ? "0 4px 20px rgba(0,0,0,0.3)" : "none", transition: "all 0.3s" }}>
                {loading ? "⏳ TRAITEMENT..." : payMode === "card" ? `🔒 CONFIRMER ${total}$` : payMode === "later" ? `⏰ RÉSERVER — PAYER SOUS 48H` : payMode === "agency" ? `🏢 RÉSERVER — PAYER À L'AGENCE` : "CHOISIR UN MODE DE PAIEMENT"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — CONFIRMATION + DOCUMENTS */}
        {step === 3 && (
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${B}, ${BD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 18px", boxShadow: `0 0 40px rgba(26,110,181,0.4)` }}>✓</div>
            <h2 style={{ fontSize: 28, fontWeight: "normal", color: B, letterSpacing: 2, margin: "0 0 8px" }}>Réservation Confirmée !</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Merci <strong style={{ color: "#f0ebe0" }}>{form.prenom} {form.nom}</strong></p>
            <p style={{ color: B, fontWeight: "bold", fontSize: 18, letterSpacing: 3, marginBottom: 16 }}>{ref}</p>
            {/* Payment status badge */}
            <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 20, marginBottom: 24, background: payMode === "card" ? `linear-gradient(135deg, ${B}, ${BD})` : payMode === "later" ? "linear-gradient(135deg, #f5a623, #e8870a)" : "linear-gradient(135deg, #22c55e, #16a34a)", fontSize: 13, fontWeight: "bold", color: "#fff" }}>
              {payMode === "card" ? "💳 Paiement en ligne effectué" : payMode === "later" ? "⏰ Paiement attendu sous 48h" : "🏢 Paiement à régler à l'agence"}
            </div>

            {/* Recap */}
            <div style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(26,110,181,0.06)", border: `1px solid ${BORDER}`, marginBottom: 28, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: B, marginBottom: 12 }}>RÉCAPITULATIF</div>
              {selectedExp && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ color: "rgba(255,255,255,0.5)" }}>🌊 {selectedExp.title}</span><span style={{ color: B }}>{totalExp}$</span></div>}
              {selectedVol && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ color: "rgba(255,255,255,0.5)" }}>✈️ {selectedVol.airline}</span><span style={{ color: B }}>{totalVol}$</span></div>}
              {selectedHotel && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ color: "rgba(255,255,255,0.5)" }}>🏨 {selectedHotel.name} × {nights}n</span><span style={{ color: B }}>{totalHotel}$</span></div>}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>TOTAL PAYÉ</span><span style={{ color: B, fontSize: 20 }}>{total}$</span>
              </div>
            </div>

            {/* Documents section */}
            <div style={{ padding: "20px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: B, marginBottom: 16 }}>📄 TÉLÉCHARGER VOS DOCUMENTS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { type: "confirmation", label: "✅ Confirmation", desc: "Réservation confirmée" },
                  { type: "facture", label: "🧾 Facture", desc: "Détail des paiements" },
                  ...(selectedHotel ? [{ type: "hotel", label: "🏨 Bon Hôtel", desc: "Réservation hôtel" }] : []),
                  { type: "itineraire", label: "✈️ Itinéraire", desc: "Programme de voyage" },
                ].map(({ type, label, desc }) => (
                  <button key={type} onClick={() => downloadDoc(type)} style={{ padding: "14px 12px", background: "rgba(26,110,181,0.08)", border: `1px solid ${BORDER}`, borderRadius: 12, color: "#f0ebe0", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,110,181,0.15)"; e.currentTarget.style.borderColor = B; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(26,110,181,0.08)"; e.currentTarget.style.borderColor = BORDER; }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{desc}</div>
                    <div style={{ fontSize: 10, color: B, marginTop: 6 }}>⬇ Télécharger PDF</div>
                  </button>
                ))}
              </div>
              <button onClick={() => {
                ["confirmation","facture","itineraire",...(selectedHotel?["hotel"]:[])]
                  .forEach((t,i) => setTimeout(() => downloadDoc(t), i*500));
              }} style={{ width: "100%", marginTop: 12, padding: "12px", background: `linear-gradient(135deg, ${B}, ${BD})`, border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: "bold", letterSpacing: 1, fontSize: 13, fontFamily: "inherit", boxShadow: `0 4px 16px rgba(26,110,181,0.3)` }}>
                ⬇ TOUT TÉLÉCHARGER (ZIP)
              </button>
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: 24 }}>
              📧 Confirmation envoyée à <strong style={{ color: "#f0ebe0" }}>{form.email}</strong><br />
              📞 Notre équipe vous contactera au <strong style={{ color: "#f0ebe0" }}>{form.tel}</strong>
            </div>

            <button onClick={() => { setStep(0); setSelectedExp(null); setSelectedVol(null); setSelectedHotel(null); setForm({ nom:"",prenom:"",email:"",tel:"",date:"",voyageurs:"1",notes:"" }); setCard({ num:"",exp:"",cvv:"",nom:"" }); }} style={{ padding: "14px 36px", background: `linear-gradient(135deg, ${B}, ${BD})`, border: "none", borderRadius: 28, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: "bold", letterSpacing: 2, fontFamily: "inherit", boxShadow: `0 8px 30px rgba(26,110,181,0.3)` }}>
              NOUVELLE RÉSERVATION →
            </button>
          </div>
        )}
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
        select option { background: #1a1025; color: #f0ebe0; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(26,110,181,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}
