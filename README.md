# Alamin Tourism & Travel — Site Web

## Structure
```
src/
  App.js          → Site principal (accueil, destinations, agent IA)
  Reservations.js → Interface de réservation complète
  Demo.js         → Démonstration interactive
  index.js        → Point d'entrée React
public/
  index.html      → HTML principal
  logo.png        → Logo Alamin Tourism & Travel
```

## Installation
```bash
npm install
cp .env.example .env
# Éditer .env et ajouter la clé API
npm start
```

## Déploiement Vercel
1. Connecter ce repo GitHub sur vercel.com
2. Settings → Environment Variables → Ajouter REACT_APP_ANTHROPIC_KEY
3. Deploy

## Connexion domaine
alamintravel-dj.com → Vercel → Settings → Domains

DNS à configurer :
- A     @    76.76.21.21
- CNAME www  cname.vercel-dns.com

## Contact agence
- Salines Ouest, Mohamed Kamil Road, Djibouti
- Tel: +253 21 25 07 17
- Mobile: +253 77 64 64 05 / 77 64 64 06
- Email: reservations@alamintravel-dj.com
