#!/bin/bash

echo "🌱 Starting Agrar Dashboard..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit .env file and add your OPENWEATHER_API_KEY"
        echo "   Get your free API key at: https://openweathermap.org/api"
        echo ""
    else
        echo "❌ .env.example not found. Please create .env file with OPENWEATHER_API_KEY"
        exit 1
    fi
fi

# Check if OPENWEATHER_API_KEY is set
source .env
if [ -z "$OPENWEATHER_API_KEY" ] || [ "$OPENWEATHER_API_KEY" = "your_openweather_api_key_here" ]; then
    echo "❌ OPENWEATHER_API_KEY not set in .env file"
    echo "   Please edit .env and add your OpenWeatherMap API key"
    exit 1
fi

echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️  Setting up database..."
docker exec -it agrar-backend sh -c "cd /app && npm run db:push"

echo "✅ Agrar Dashboard is ready!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:5002"
echo "   Database: localhost:5434"
echo ""
echo "📝 To stop the application: docker-compose down"
echo "📝 To view logs: docker-compose logs -f"