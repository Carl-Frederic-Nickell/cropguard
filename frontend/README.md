# Agrar Dashboard

Ein landwirtschaftliches Dashboard zur Überwachung von Erntebedingungen basierend auf Wetterdaten. Entwickelt als Teil des CloudHelden DevOps Engineer Kurses mit Fokus auf Sicherheit und Best Practices.

## 🎯 Projektübersicht

Das Agrar Dashboard hilft Landwirten bei der Entscheidung, wann sie ihre Ernte einfahren sollten. Es bietet:

- **Standortbasierte Wettervorhersage** (7 Tage)
- **Ernte-Empfehlungen** basierend auf Temperatur, Luftfeuchtigkeit und Niederschlag
- **Multi-Crop Support** für verschiedene Getreide und Gemüse
- **Farbkodierte Bewertungen** (Rot/Orange/Grün) für Erntebedingungen

## 🏗️ Architektur

### Tech Stack
- **Frontend**: Next.js 15 mit TypeScript und Tailwind CSS
- **Backend**: Node.js/Express mit TypeScript
- **Datenbank**: PostgreSQL 15
- **Authentication**: NextAuth.js (geplant)
- **Wetter-API**: OpenWeatherMap
- **Infrastructure**: Docker & Docker Compose
- **Deployment**: Synology NAS

### Container Architektur
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   Next.js       │◄──►│   Express       │◄──►│    Database     │
│   Port: 3001    │    │   Port: 5002    │    │   Port: 5434    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation & Setup

### Voraussetzungen
- Docker & Docker Compose
- Synology NAS oder Linux-System
- OpenWeatherMap API Key (kostenlos)

### 1. Repository Setup
```bash
mkdir -p /volume1/docker/agrar-dashboard
cd /volume1/docker/agrar-dashboard
```

### 2. Projektstruktur erstellen
```
agrar-dashboard/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   └── src/
└── README.md
```

### 3. Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://agrar_user:secure_password_2024@postgres:5432/agrar_dashboard?schema=public"
JWT_SECRET=backend_jwt_secret_key_2024
OPENWEATHER_API_KEY=your_openweather_api_key_here
PORT=5000
```

**Frontend (.env.local)**
```env
NEXTAUTH_SECRET=agrar_dashboard_secret_key_2024
NEXTAUTH_URL=http://localhost:3001
DATABASE_URL="postgresql://agrar_user:secure_password_2024@postgres:5432/agrar_dashboard?schema=public"
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 4. Container starten
```bash
docker-compose up --build -d
```

### 5. Datenbank initialisieren
```bash
docker exec -it agrar-backend sh -c "cd /app && npm run db:push"
```

## 📁 Projekt-Struktur

### Backend API Endpoints
```
/api/auth/
├── POST /register    # Benutzerregistrierung
└── POST /login       # Benutzeranmeldung

/api/farms/
├── GET /             # Alle Farmen abrufen
├── POST /            # Farm erstellen
└── POST /:id/crops   # Crop zu Farm hinzufügen

/api/weather/
└── GET /             # Wetterdaten abrufen
```

### Frontend Routen
```
/                     # Startseite (Redirect)
/login               # Anmeldeseite
/register            # Registrierungsseite
/dashboard           # Hauptdashboard
/dashboard/farms     # Farm-Management
/weather             # Wetter-Dashboard
```

### Datenbank Schema
```sql
-- Benutzer
User {
  id: String (Primary Key)
  email: String (Unique)
  password: String (Hashed)
  name: String
  createdAt: DateTime
}

-- Farmen/Felder
Farm {
  id: String (Primary Key)
  name: String
  location: String
  latitude: Float
  longitude: Float
  userId: String (Foreign Key)
  createdAt: DateTime
}

-- Kulturen/Pflanzen
Crop {
  id: String (Primary Key)
  name: String
  type: String
  plantedDate: DateTime
  farmId: String (Foreign Key)
  createdAt: DateTime
}
```

## 🌦️ Wetter-Integration

### OpenWeatherMap API
- **Current Weather**: Aktuelle Bedingungen
- **5-Day Forecast**: 3-Stunden Intervalle
- **Datenfelder**: Temperatur, Luftfeuchtigkeit, Niederschlag, Wind

### Ernte-Algorithmus
```typescript
// Beispiel-Kriterien für Weizen
const wheatCriteria = {
  minTemp: 15,      // Mindesttemperatur
  maxTemp: 25,      // Maximaltemperatur
  maxHumidity: 85,  // Max. Luftfeuchtigkeit
  maxPrecip: 2,     // Max. Niederschlag (mm)
  maxWind: 8        // Max. Windgeschwindigkeit
}
```

### Bewertungssystem
- 🟢 **Grün**: Optimale Erntebedingungen
- 🟡 **Orange**: Möglich, aber nicht ideal
- 🔴 **Rot**: Ernte nicht empfohlen

## 🛠️ Entwicklung

### Backend Development
```bash
cd backend
npm run dev          # Development Server
npm run build        # Production Build
npm run db:generate  # Prisma Client generieren
npm run db:push      # Schema zu DB pushen
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development Server
npm run build        # Production Build
npm run lint         # Code Linting
```

### Container Management
```bash
# Alle Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Logs anzeigen
docker-compose logs frontend
docker-compose logs backend

# Container neu bauen
docker-compose up --build -d
```

## 🔒 Sicherheit & Best Practices

### Implementierte Sicherheitsmaßnahmen
- **Passwort Hashing**: bcrypt mit 12 Runden
- **JWT Tokens**: 7 Tage Gültigkeit
- **CORS**: Konfiguriert für Frontend-Domain
- **Helmet.js**: Security Headers
- **Input Validation**: Server-seitige Validierung
- **Environment Variables**: Sensible Daten ausgelagert

### Netzwerk-Isolation
- **Docker Networks**: Container kommunizieren über internes Netz
- **Port-Mapping**: Nur notwendige Ports exponiert
- **Database**: Nur intern erreichbar

## 📊 Features Roadmap

### ✅ Implementiert
- [x] Benutzer-Authentifizierung
- [x] Wetter-API Integration
- [x] Responsive Dashboard
- [x] Docker Container Setup

### 🔄 In Entwicklung
- [ ] Vollständige NextAuth Integration
- [ ] Farm-Management Interface
- [ ] Crop-spezifische Empfehlungen
- [ ] Grafische Wettervisualisierung

### 🎯 Geplant
- [ ] Historische Datenanalyse
- [ ] Mobile App (React Native)
- [ ] Multi-Language Support
- [ ] Advanced Analytics
- [ ] Notification System

## 🐛 Troubleshooting

### Häufige Probleme

**Container startet nicht**
```bash
# Port-Konflikte prüfen
netstat -tuln | grep 3001
netstat -tuln | grep 5002

# Logs prüfen
docker-compose logs [service-name]
```

**Datenbankverbindung fehlgeschlagen**
```bash
# Container Netzwerk prüfen
docker network ls
docker network inspect agrar-dashboard_agrar-network

# Datenbank-Container prüfen
docker exec -it agrar-db psql -U agrar_user -d agrar_dashboard
```

**NextAuth Fehler**
```bash
# NextAuth Konfiguration prüfen
docker exec -it agrar-frontend ls -la /app/src/app/api/auth/
```

### Port-Mapping
- **Frontend**: localhost:3001 → Container:3000
- **Backend**: localhost:5002 → Container:5000
- **Database**: localhost:5434 → Container:5432

## 📞 Support & Kontakt

mail@carl-cyber.tech

### Nützliche Links
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Guide](https://docs.docker.com/compose/)

---

**Entwickelt mit 🌱 für die Landwirtschaft**
