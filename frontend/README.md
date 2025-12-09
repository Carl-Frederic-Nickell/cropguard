# CropGuard Dashboard

Ein landwirtschaftliches Dashboard zur Überwachung von Erntebedingungen und Farm-Management basierend auf Wetterdaten. Entwickelt als Teil des CloudHelden DevOps Engineer Kurses mit Fokus auf Sicherheit und Best Practices.

## 🎯 Projektübersicht

CropGuard hilft Landwirten bei der Entscheidung, wann sie ihre Ernte einfahren sollten und bietet umfassendes Farm-Management. Es bietet:

- **Standortbasierte Wettervorhersage** (7 Tage) mit agricultural analysis
- **Intelligente Ernte-Empfehlungen** basierend auf Temperatur, Luftfeuchtigkeit und Niederschlag
- **Multi-Crop Support** für verschiedene Getreide und Gemüse
- **Interaktive Deutschland-Karte** mit Feldstandorten und Risiko-Visualization
- **Erweiterte Wetterrisiko-Analyse** mit saisonaler und kultur-spezifischer Bewertung
- **Farm- und Kultur-Management** mit CRUD-Operationen
- **Dynamische Willkommensnachrichten** mit täglich wechselnden landwirtschaftlichen Tipps
- **Filter-System** für Kulturen und Warnungen

## 🏗️ Architektur

### Tech Stack
- **Frontend**: Next.js 15 mit TypeScript und Tailwind CSS
- **Backend**: Node.js/Express mit TypeScript
- **Datenbank**: SQLite (Entwicklung), PostgreSQL (Produktion)
- **Authentication**: NextAuth.js (geplant)
- **Wetter-API**: OpenWeatherMap
- **Karten**: Leaflet/React-Leaflet mit interaktiven Features
- **Infrastructure**: Docker & Docker Compose
- **Deployment**: Synology NAS

### Container Architektur
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Next.js       │◄──►│   Express       │◄──►│   SQLite/       │
│   Port: 3001    │    │   Port: 5002    │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ und npm
- OpenWeatherMap API Key (kostenlos)
- Optional: Docker & Docker Compose

### 1. Repository Setup
```bash
git clone [repository-url]
cd agrar-dashboard
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Bearbeiten Sie .env.local mit Ihren API-Keys
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Bearbeiten Sie .env mit Ihren API-Keys
npm run db:generate
npm run db:push
npm run dev
```

### 4. Environment Variables

**Backend (.env)**
```env
DATABASE_URL="file:./dev.db"
OPENWEATHER_API_KEY=your_openweather_api_key_here
PORT=5002
```

**Frontend (.env.local)**
```env
NEXTAUTH_SECRET=agrar_dashboard_secret_key_2024
NEXTAUTH_URL=http://localhost:3001
BACKEND_URL=http://localhost:5002
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

## 📁 Neue Features & Verbesserungen

### 🗺️ Interaktive Deutschland-Karte
- **Leaflet Integration**: Vollständig interaktive Karte von Deutschland
- **Farm Pins**: Standort-basierte Pins mit Risiko-Farben (Grün/Gelb/Rot)
- **Detaillierte Popups**: Farm-Informationen, Kultur-Details, Wetterrisiken
- **Toggle-Funktionalität**: Karte ein-/ausblenden
- **Responsive Design**: Mobile-optimiert

### 🌾 Erweiterte Farm-Verwaltung
- **CRUD-Operationen**: Vollständiges Create, Read, Update, Delete für Felder
- **Erweiterte Feld-Karten**: Quick Stats, Bewässerungsstatus, letzte Pflege
- **Klickbare Standorte**: Direkte Navigation zur Getreidekarte
- **Kultur-Details**: Anzeige von Kulturarten und Pflanzdaten
- **Visuelle Verbesserungen**: Hover-Effekte, Icons, Legende

### 🌤️ Intelligente Wetteranalyse
- **Saisonale Bewertung**: Kontext-basierte Feuchtigkeitsrisiken je nach Jahreszeit
- **Kultur-spezifische Toleranzen**: Individuelle Schwellenwerte für verschiedene Pflanzen
- **Landwirtschaftliche Indikatoren**: Feldarbeits-Eignung, Sprühbedingungen, Krankheitsrisiko
- **Erweiterte 7-Tage-Analyse**: Grafische Darstellung mit Temperatur- und Feuchtigkeitstrends
- **Intelligente Ernte-Empfehlungen**: Kontextuelle Ratschläge basierend auf Wetter und Erntezeiten

### 📊 Filter-System & Personalisierung
- **Kultur-Filter**: Selektive Anzeige nach Pflanzenarten mit Checkboxes
- **Warnungen-Filter**: Option für alle Warnungen oder nur kritische
- **Dynamische Nachrichten**: 15 verschiedene tägliche landwirtschaftliche Tipps
- **Benutzer-Personalisierung**: Angepasste Begrüßung für "Carl"
- **Marken-Update**: Vollständiger Rebrand von "Agrar Dashboard" zu "CropGuard"

### 🛠️ Technische Verbesserungen
- **Hydration Error Fix**: SSR/Client-Rendering Kompatibilität
- **Performance Optimierung**: Effiziente API-Calls und State-Management
- **Error Handling**: Robuste Fehlerbehandlung und Fallbacks
- **Code Organisation**: Modulare Komponenten-Struktur
- **Type Safety**: Vollständige TypeScript-Integration

## 🌦️ Wetter-Integration

### OpenWeatherMap API
- **Current Weather**: Aktuelle Bedingungen mit agricultural context
- **7-Day Forecast**: Detaillierte Vorhersagen mit Risiko-Bewertung
- **Datenfelder**: Temperatur, Luftfeuchtigkeit, Niederschlag, Wind, Bedingungen

### Erweiterte Ernte-Algorithmen
```typescript
// Saisonale und kultur-spezifische Bewertung
const calculateHumidityRisk = (humidity: number, date: Date, cropType: string) => {
  const season = getSeason(date)
  const cropTolerance = getCropTolerance(cropType)
  
  if (humidity >= cropTolerance.critical) {
    return generateRiskAssessment(season, cropType, humidity)
  }
}

// Beispiel-Kriterien für Kulturen
const cropCriteria = {
  weizen: { minTemp: 22, maxTemp: 26, maxHumidity: 60 },
  gerste: { minTemp: 18, maxTemp: 24, maxHumidity: 17 },
  raps: { minTemp: 20, maxTemp: 25, maxHumidity: 40 },
  mais: { minTemp: 15, maxTemp: 30, maxHumidity: 20 }
}
```

### Bewertungssystem
- 🟢 **Grün (Optimal)**: Perfekte Erntebedingungen
- 🟡 **Gelb (Akzeptabel)**: Ernte möglich, nicht optimal
- 🟠 **Orange (Vorsicht)**: Erhöhte Aufmerksamkeit erforderlich
- 🔴 **Rot (Kritisch)**: Ernte nicht empfohlen

## 📁 Aktualisierte API-Struktur

### Backend API Endpoints
```
/api/farms/
├── GET /             # Alle Farmen mit Kulturen abrufen
├── POST /            # Neue Farm erstellen
├── DELETE /:id       # Farm löschen
├── POST /:id/crops   # Kultur zu Farm hinzufügen
└── DELETE /:farmId/crops/:cropId  # Kultur löschen

/api/weather/
└── GET /             # Erweiterte Wetterdaten mit Risiko-Analyse
    ├── ?lat=51.96&lon=7.62&cropType=weizen
    └── Unterstützt alle Kulturarten für spezifische Bewertungen
```

### Frontend Routen
```
/dashboard/
├── /                 # Hauptdashboard mit Filter-System
├── /farms            # Farm-Management mit erweiterten Features
├── /crops            # Kultur-Verwaltung mit Löschfunktion
├── /weather          # Erweiterte Wetter-Analyse
└── /getreidekarte    # Interaktive Deutschland-Karte
```

## 🛠️ Entwicklung

### Frontend Development
```bash
cd frontend
npm run dev          # Development Server (Port 3001)
npm run build        # Production Build
npm run lint         # Code Linting
npm run typecheck    # TypeScript Check
```

### Backend Development
```bash
cd backend
npm run dev          # Development Server (Port 5002)
npm run build        # Production Build
npm run db:generate  # Prisma Client generieren
npm run db:push      # Schema zu DB pushen
npm run db:studio    # Prisma Studio öffnen
```

### Datenbank Schema (Erweitert)
```sql
-- Farmen/Felder
Farm {
  id: String (Primary Key)
  name: String
  location: String
  latitude: Float
  longitude: Float
  createdAt: DateTime
  updatedAt: DateTime
  crops: Crop[]
}

-- Kulturen/Pflanzen
Crop {
  id: String (Primary Key)
  name: String
  type: String (weizen, gerste, raps, mais, etc.)
  plantedDate: DateTime
  farmId: String (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
  farm: Farm
}
```

## 📊 Features Status

### ✅ Vollständig Implementiert
- [x] **Interaktive Deutschland-Karte** mit Leaflet
- [x] **Erweiterte Farm-Verwaltung** mit CRUD-Operationen  
- [x] **Kultur-Management** mit Löschfunktion
- [x] **Intelligente Wetteranalyse** mit saisonalen Bewertungen
- [x] **Filter-System** für Kulturen und Warnungen
- [x] **7-Tage Ernte-Analyse** mit grafischen Trends
- [x] **Personalisierte Nachrichten** mit landwirtschaftlichen Tipps
- [x] **Responsive Design** für alle Geräte
- [x] **Marken-Rebrand** zu "CropGuard"
- [x] **Hydration Error Fixes** für SSR-Kompatibilität

### 🎯 Geplante Features
- [ ] Benutzer-Authentifizierung mit NextAuth
- [ ] Historische Datenanalyse und Trends
- [ ] Push-Benachrichtigungen für kritische Wetter-Events
- [ ] Mobile App (React Native)
- [ ] Multi-Language Support (EN/DE)
- [ ] Advanced Analytics Dashboard
- [ ] Satellite Imagery Integration
- [ ] IoT Sensor Integration

## 🔒 Sicherheit & Best Practices

### Implementierte Sicherheitsmaßnahmen
- **Input Validation**: Server- und client-seitige Validierung
- **Error Boundaries**: React Error Boundaries für robuste UI
- **Environment Variables**: Sensible Daten ausgelagert
- **CORS**: Konfiguriert für Frontend-Domain
- **Type Safety**: Vollständige TypeScript-Abdeckung

### Code Quality
- **ESLint**: Code-Qualität und Konsistenz
- **Prettier**: Code-Formatierung
- **TypeScript**: Type Safety und bessere DX
- **Modular Architecture**: Wiederverwendbare Komponenten

## 🐛 Troubleshooting

### Häufige Probleme

**Leaflet Hydration Errors**
```bash
# .next Cache löschen
rm -rf .next
npm run dev
```

**Port-Konflikte**
```bash
# Ports prüfen
lsof -i :3001  # Frontend
lsof -i :5002  # Backend
```

**Wetter-API Probleme**
```bash
# API-Key in Environment Variables prüfen
echo $OPENWEATHER_API_KEY
```

**Datenbank-Verbindung**
```bash
# Prisma Studio öffnen
npx prisma studio
```

## 📞 Support & Kontakt

**Entwickler**: Carl  
**Email**: mail@carl-cyber.tech

### Nützliche Links
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Entwickelt mit 🌱 für die moderne Landwirtschaft**