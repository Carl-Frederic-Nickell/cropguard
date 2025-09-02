# Agrar Dashboard - Setup & Test Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenWeatherMap API Key (free at https://openweathermap.org/api)

### 1. Clone and Setup
```bash
cd /path/to/agrar-dashboard
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file and add your OpenWeatherMap API key:
```env
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Start Application
```bash
# Using the startup script (recommended)
./start.sh

# Or manually
docker-compose up --build -d
docker exec -it agrar-backend sh -c "cd /app && npm run db:push"
```

### 4. Access Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5002
- **Database**: localhost:5434

## 🧪 Testing Instructions

### 1. Registration & Login
1. Visit http://localhost:3001
2. Click "Registrieren" to create an account
3. Fill form: Name, Email, Password (min 6 chars)
4. Login with credentials

### 2. Farm Management
1. Navigate to "Felder" 
2. Click "Feld hinzufügen"
3. Add farm with coordinates (example: Münster: 51.9607, 7.6261)
4. Verify farm appears in list

### 3. Crop Management  
1. Navigate to "Kulturen"
2. Click "Kultur hinzufügen"
3. Select crop type (Weizen, Gerste, Raps, Mais, Sonnenblumen, Kartoffeln, Zuckerrüben, Tomaten)
4. Test different view modes (Grid/List)
5. Use category filters (Alle/Getreide/Gemüse)

### 4. Weather Dashboard
1. Navigate to "Wetter"
2. Select crop type from dropdown
3. Choose location (farm or custom coordinates)
4. Verify current weather data displays
5. Check 7-day forecast appears
6. Verify today/tomorrow cards show detailed info

### 5. Getreidekarte (Crop Status)
1. Navigate to "Getreidekarte"
2. Verify crops show with color-coded status:
   - 🟢 OPTIMAL (Green)
   - 🟡 VORSICHT (Yellow) 
   - 🔴 RISIKO (Red)
3. Check harvest recommendations include agricultural comments
4. Test status filters (All/Optimal/Caution/Risk)

### 6. Harvest Criteria Management
1. Navigate to "Kulturen" → Individual crop → Settings (if implemented)
2. Or access via Getreidekarte details
3. Verify agricultural criteria are displayed:
   - **Weizen**: 22-26°C, ≤60% humidity
   - **Gerste**: 18-24°C, ≤17% humidity  
   - **Raps**: 20-25°C, ≤40% humidity
   - **Mais**: 15-30°C, ≤20% humidity
   - **Kartoffeln**: 10-18°C, ≤75% humidity
   - **Zuckerrüben**: 8-15°C, ≤80% humidity
   - **Sonnenblumen**: 22-28°C, ≤15% humidity

## 🔍 Features to Test

### ✅ Core Functionality
- [x] User registration and authentication
- [x] Farm management with GPS coordinates
- [x] 8 crop types with real agricultural criteria
- [x] Weather integration (current + 7-day forecast)
- [x] Color-coded harvest recommendations
- [x] Today/tomorrow weather cards
- [x] Getreidekarte status dashboard
- [x] Crop filtering and categorization
- [x] Responsive design (mobile/desktop)

### ✅ Agricultural Features
- [x] Precise temperature ranges per crop
- [x] Strict humidity requirements 
- [x] Precipitation monitoring
- [x] Wind speed assessment
- [x] Agricultural-grade harvest comments
- [x] Quality-focused recommendations
- [x] Risk factor analysis

### ✅ Technical Features
- [x] Next.js 15 frontend with TypeScript
- [x] Node.js/Express backend with TypeScript
- [x] PostgreSQL database with Prisma ORM
- [x] NextAuth.js authentication
- [x] OpenWeatherMap API integration
- [x] Docker containerization
- [x] German localization

## 🐛 Troubleshooting

### Common Issues

**1. Containers won't start**
```bash
# Check ports aren't in use
netstat -tuln | grep 3001
netstat -tuln | grep 5002
netstat -tuln | grep 5434

# View logs
docker-compose logs -f
```

**2. Database connection errors**
```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
sleep 10
docker-compose up -d backend frontend
docker exec -it agrar-backend sh -c "cd /app && npm run db:push"
```

**3. Weather data not loading**
- Verify OPENWEATHER_API_KEY is set in .env
- Check API key is active (may take a few minutes after creation)
- View backend logs: `docker logs agrar-backend`

**4. Authentication issues**
- Clear browser cookies/localStorage for localhost:3001
- Check NextAuth configuration in logs
- Verify NEXTAUTH_SECRET is set

### Container Management
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild after code changes
docker-compose up --build -d

# View specific service logs
docker logs agrar-frontend
docker logs agrar-backend
docker logs agrar-db

# Execute commands in containers
docker exec -it agrar-backend sh
docker exec -it agrar-frontend sh
```

## 📊 Test Data Examples

### Sample Farm Coordinates
- **Münster, NRW**: 51.9607, 7.6261
- **Berlin**: 52.5200, 13.4050
- **Munich**: 48.1351, 11.5820
- **Hamburg**: 53.5511, 9.9937

### Expected Behavior
- **Weizen**: Requires 22-26°C, very strict humidity (≤60%)
- **Raps**: Most sensitive, ≤40% humidity, risk of "Auswuchs"
- **Gerste**: Malting quality focus, ≤17% humidity
- **Mais**: Broad temperature range, schimmel risk warning
- **Kartoffeln**: Cool harvest preference, shell integrity focus
- **Zuckerrüben**: Must be harvested cool, storage loss warnings
- **Sonnenblumen**: Oil quality focus, extremely low humidity tolerance (≤15%)

## 📈 Performance Notes
- First API calls may be slower (cold start)
- Weather data is cached by OpenWeatherMap  
- Database queries optimized with proper relations
- Frontend uses server-side rendering where appropriate

## 🔐 Security Features
- Bcrypt password hashing (12 rounds)
- JWT authentication with 7-day expiry
- CORS configuration
- Helmet security headers
- Input validation on all forms
- Environment variable security