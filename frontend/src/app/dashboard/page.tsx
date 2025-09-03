'use client'

import { useState, useEffect } from 'react'
import { CloudRain, Thermometer, Droplets, Wind, Calendar, MapPin, Sun, Cloud, CloudSnow, AlertTriangle, XCircle, Clock } from 'lucide-react'

interface WeatherData {
  current: {
    temperature: number
    humidity: number
    precipitation: number
    windSpeed: number
    condition: string
  }
  forecast: Array<{
    temperature: number
    humidity: number
    precipitation: number
    windSpeed: number
    condition: string
    date: string
  }>
}

export default function DashboardPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [locationInput, setLocationInput] = useState("Münster")
  const [coordinates, setCoordinates] = useState({ lat: 51.9607, lon: 7.6261 })
  const [farmStats, setFarmStats] = useState({ farms: 0, crops: 0 })
  const [weatherRisks, setWeatherRisks] = useState<any[]>([])
  const [fieldRiskGraphs, setFieldRiskGraphs] = useState<any[]>([])

  useEffect(() => {
    fetchWeatherData()
    fetchFarmStats()
    fetchWeatherRisks()
    fetchFieldRiskGraphs()
  }, [coordinates])

  const fetchWeatherData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&cropType=weizen`)
      if (response.ok) {
        const data = await response.json()
        setWeatherData(data)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFarmStats = async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const farms = await response.json()
        const totalCrops = farms.reduce((sum: number, farm: any) => sum + farm.crops.length, 0)
        setFarmStats({ farms: farms.length, crops: totalCrops })
      }
    } catch (error) {
      console.error('Error fetching farm stats:', error)
    }
  }

  const fetchWeatherRisks = async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const farms = await response.json()
        const risks: any[] = []
        
        for (const farm of farms) {
          for (const crop of farm.crops) {
            try {
              const weatherResponse = await fetch(
                `/api/weather?lat=${farm.latitude}&lon=${farm.longitude}&cropType=${crop.type}`
              )
              
              if (weatherResponse.ok) {
                const weatherData = await weatherResponse.json()
                
                // Check for weather risks over next 7 days
                if (weatherData.forecast) {
                  weatherData.forecast.slice(0, 7).forEach((day: any, index: number) => {
                    const date = new Date()
                    date.setDate(date.getDate() + index)
                    
                    const riskFactors = []
                    
                    // High precipitation risk
                    if (day.precipitation > 5) {
                      riskFactors.push({
                        type: 'Starkregen',
                        severity: 'high',
                        value: `${day.precipitation.toFixed(1)}mm`
                      })
                    }
                    
                    // High humidity risk
                    if (day.humidity > 85) {
                      riskFactors.push({
                        type: 'Hohe Feuchtigkeit',
                        severity: day.humidity > 90 ? 'high' : 'medium',
                        value: `${day.humidity}%`
                      })
                    }
                    
                    // Wind risk
                    if (day.windSpeed > 15) {
                      riskFactors.push({
                        type: 'Starker Wind',
                        severity: day.windSpeed > 20 ? 'high' : 'medium',
                        value: `${day.windSpeed.toFixed(1)} m/s`
                      })
                    }
                    
                    // Temperature risk
                    if (day.temperature < 5 || day.temperature > 35) {
                      riskFactors.push({
                        type: day.temperature < 5 ? 'Frost' : 'Hitze',
                        severity: 'high',
                        value: `${day.temperature.toFixed(1)}°C`
                      })
                    }
                    
                    if (riskFactors.length > 0) {
                      risks.push({
                        farmName: farm.name,
                        cropName: crop.name,
                        cropType: crop.type,
                        date: date.toISOString().split('T')[0],
                        dateFormatted: date.toLocaleDateString('de-DE'),
                        dayName: date.toLocaleDateString('de-DE', { weekday: 'short' }),
                        risks: riskFactors
                      })
                    }
                  })
                }
              }
            } catch (weatherError) {
              console.error(`Error fetching weather for ${farm.name}:`, weatherError)
            }
          }
        }
        
        // Sort by date and severity
        risks.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date)
          if (dateCompare === 0) {
            const highRisksA = a.risks.filter((r: any) => r.severity === 'high').length
            const highRisksB = b.risks.filter((r: any) => r.severity === 'high').length
            return highRisksB - highRisksA
          }
          return dateCompare
        })
        
        setWeatherRisks(risks.slice(0, 10)) // Limit to 10 most critical risks
      }
    } catch (error) {
      console.error('Error fetching weather risks:', error)
    }
  }

  const fetchFieldRiskGraphs = async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const farms = await response.json()
        const fieldGraphs: any[] = []
        
        for (const farm of farms) {
          for (const crop of farm.crops) {
            try {
              const weatherResponse = await fetch(
                `/api/weather?lat=${farm.latitude}&lon=${farm.longitude}&cropType=${crop.type}`
              )
              
              if (weatherResponse.ok) {
                const weatherData = await weatherResponse.json()
                
                const dailyRisks = []
                
                // Calculate risk for next 7 days
                for (let i = 0; i < 7; i++) {
                  const date = new Date()
                  date.setDate(date.getDate() + i)
                  
                  const dayData = weatherData.forecast?.[i] || weatherData.current
                  
                  // Calculate risk score (0-100)
                  let riskScore = 0
                  const riskFactors = []
                  
                  // Temperature risk
                  if (dayData.temperature < 5) {
                    const tempRisk = Math.max(0, (5 - dayData.temperature) * 10)
                    riskScore += tempRisk
                    riskFactors.push({ type: 'Frost', score: tempRisk, value: `${dayData.temperature.toFixed(1)}°C` })
                  } else if (dayData.temperature > 35) {
                    const tempRisk = Math.min(50, (dayData.temperature - 35) * 5)
                    riskScore += tempRisk
                    riskFactors.push({ type: 'Hitze', score: tempRisk, value: `${dayData.temperature.toFixed(1)}°C` })
                  }
                  
                  // Precipitation risk
                  if (dayData.precipitation > 2) {
                    const precipRisk = Math.min(40, (dayData.precipitation - 2) * 8)
                    riskScore += precipRisk
                    riskFactors.push({ type: 'Niederschlag', score: precipRisk, value: `${dayData.precipitation.toFixed(1)}mm` })
                  }
                  
                  // Humidity risk
                  if (dayData.humidity > 85) {
                    const humidityRisk = Math.min(30, (dayData.humidity - 85) * 2)
                    riskScore += humidityRisk
                    riskFactors.push({ type: 'Feuchtigkeit', score: humidityRisk, value: `${dayData.humidity}%` })
                  }
                  
                  // Wind risk
                  if (dayData.windSpeed > 15) {
                    const windRisk = Math.min(25, (dayData.windSpeed - 15) * 2.5)
                    riskScore += windRisk
                    riskFactors.push({ type: 'Wind', score: windRisk, value: `${dayData.windSpeed.toFixed(1)} m/s` })
                  }
                  
                  // Cap total risk at 100
                  riskScore = Math.min(100, riskScore)
                  
                  dailyRisks.push({
                    date: date.toISOString().split('T')[0],
                    dayName: date.toLocaleDateString('de-DE', { weekday: 'short' }),
                    dayNumber: date.getDate(),
                    riskScore: Math.round(riskScore),
                    riskFactors,
                    weather: {
                      temperature: dayData.temperature,
                      precipitation: dayData.precipitation,
                      humidity: dayData.humidity,
                      windSpeed: dayData.windSpeed,
                      condition: dayData.condition
                    }
                  })
                }
                
                fieldGraphs.push({
                  farmId: farm.id,
                  farmName: farm.name,
                  farmLocation: farm.location,
                  cropId: crop.id,
                  cropName: crop.name,
                  cropType: crop.type,
                  dailyRisks,
                  maxRisk: Math.max(...dailyRisks.map(d => d.riskScore)),
                  avgRisk: Math.round(dailyRisks.reduce((sum, d) => sum + d.riskScore, 0) / 7)
                })
              }
            } catch (weatherError) {
              console.error(`Error fetching weather for ${farm.name}:`, weatherError)
            }
          }
        }
        
        // Sort by highest average risk
        fieldGraphs.sort((a, b) => b.maxRisk - a.maxRisk)
        
        setFieldRiskGraphs(fieldGraphs)
      }
    } catch (error) {
      console.error('Error fetching field risk graphs:', error)
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return 'bg-red-500'
    if (riskScore >= 40) return 'bg-yellow-500'
    if (riskScore >= 20) return 'bg-orange-400'
    if (riskScore > 0) return 'bg-green-400'
    return 'bg-green-300'
  }

  const getRiskTextColor = (riskScore: number) => {
    if (riskScore >= 70) return 'text-red-600'
    if (riskScore >= 40) return 'text-yellow-600'
    if (riskScore >= 20) return 'text-orange-500'
    return 'text-green-600'
  }

  const geocodeLocation = async (location: string) => {
    try {
      // Erweiterte deutsche Städte-Datenbank
      const knownLocations: { [key: string]: { lat: number, lon: number } } = {
        'berlin': { lat: 52.5200, lon: 13.4050 },
        'hamburg': { lat: 53.5511, lon: 9.9937 },
        'münchen': { lat: 48.1351, lon: 11.5820 },
        'köln': { lat: 50.9375, lon: 6.9603 },
        'frankfurt': { lat: 50.1109, lon: 8.6821 },
        'stuttgart': { lat: 48.7758, lon: 9.1829 },
        'düsseldorf': { lat: 51.2277, lon: 6.7735 },
        'dortmund': { lat: 51.5136, lon: 7.4653 },
        'essen': { lat: 51.4556, lon: 7.0116 },
        'leipzig': { lat: 51.3397, lon: 12.3731 },
        'dresden': { lat: 51.0504, lon: 13.7373 },
        'hannover': { lat: 52.3759, lon: 9.7320 },
        'nürnberg': { lat: 49.4521, lon: 11.0767 },
        'duisburg': { lat: 51.4344, lon: 6.7623 },
        'münster': { lat: 51.9607, lon: 7.6261 },
        'bremen': { lat: 53.0793, lon: 8.8017 },
        'bochum': { lat: 51.4818, lon: 7.2162 },
        'wuppertal': { lat: 51.2562, lon: 7.1508 },
        'bielefeld': { lat: 52.0302, lon: 8.5325 },
        'bonn': { lat: 50.7374, lon: 7.0982 },
        'mannheim': { lat: 49.4875, lon: 8.4660 },
        'karlsruhe': { lat: 49.0069, lon: 8.4037 },
        'wiesbaden': { lat: 50.0782, lon: 8.2398 },
        'augsburg': { lat: 48.3705, lon: 10.8978 },
        'aachen': { lat: 50.7753, lon: 6.0839 },
        'mönchengladbach': { lat: 51.1805, lon: 6.4428 },
        'gelsenkirchen': { lat: 51.5177, lon: 7.0857 },
        'braunschweig': { lat: 52.2689, lon: 10.5268 },
        'chemnitz': { lat: 50.8322, lon: 12.9252 },
        'kiel': { lat: 54.3233, lon: 10.1228 },
        'krefeld': { lat: 51.3388, lon: 6.5853 },
        'halle': { lat: 51.4825, lon: 11.9707 },
        'magdeburg': { lat: 52.1205, lon: 11.6276 },
        'freiburg': { lat: 47.9990, lon: 7.8421 },
        'oberhausen': { lat: 51.4963, lon: 6.8626 },
        'lübeck': { lat: 53.8654, lon: 10.6865 },
        'erfurt': { lat: 50.9848, lon: 11.0299 },
        'rostock': { lat: 54.0924, lon: 12.0991 },
        'mainz': { lat: 49.9929, lon: 8.2473 },
        'kassel': { lat: 51.3127, lon: 9.4797 },
        'hagen': { lat: 51.3670, lon: 7.4637 },
        'hamm': { lat: 51.6806, lon: 7.8142 },
        'saarbrücken': { lat: 49.2401, lon: 6.9969 },
        'mülheim': { lat: 51.4267, lon: 6.8824 },
        'potsdam': { lat: 52.3906, lon: 13.0645 },
        'ludwigshafen': { lat: 49.4774, lon: 8.4353 },
        'oldenburg': { lat: 53.1435, lon: 8.2146 },
        'leverkusen': { lat: 51.0458, lon: 6.9865 },
        'osnabrück': { lat: 52.2799, lon: 8.0472 },
        'solingen': { lat: 51.1657, lon: 7.0667 },
        'heidelberg': { lat: 49.3988, lon: 8.6724 },
        'herne': { lat: 51.5386, lon: 7.2251 },
        'neuss': { lat: 51.2041, lon: 6.6908 },
        'darmstadt': { lat: 49.8728, lon: 8.6512 },
        'paderborn': { lat: 51.7189, lon: 8.7575 },
        'regensburg': { lat: 49.0134, lon: 12.1016 },
        'ingolstadt': { lat: 48.7665, lon: 11.4257 },
        'würzburg': { lat: 49.7913, lon: 9.9534 },
        'fürth': { lat: 49.4793, lon: 10.9896 },
        'wolfsburg': { lat: 52.4227, lon: 10.7865 },
        'offenbach': { lat: 50.0955, lon: 8.7761 },
        'ulm': { lat: 48.3984, lon: 9.9916 },
        'heilbronn': { lat: 49.1427, lon: 9.2109 },
        'pforzheim': { lat: 48.8922, lon: 8.6940 },
        'göttingen': { lat: 51.5412, lon: 9.9158 },
        'bottrop': { lat: 51.5216, lon: 6.9289 },
        'trier': { lat: 49.7596, lon: 6.6441 },
        'recklinghausen': { lat: 51.6181, lon: 7.1983 },
        'remscheid': { lat: 51.1789, lon: 7.1906 },
        'bremerhaven': { lat: 53.5396, lon: 8.5809 },
        'koblenz': { lat: 50.3569, lon: 7.5890 },
        'bergisch gladbach': { lat: 50.9924, lon: 7.1283 },
        'erlangen': { lat: 49.5897, lon: 11.0040 },
        'jena': { lat: 50.9272, lon: 11.5896 },
        'siegen': { lat: 50.8749, lon: 8.0247 }
      }

      const normalizedLocation = location.toLowerCase().trim()
      if (knownLocations[normalizedLocation]) {
        setCoordinates(knownLocations[normalizedLocation])
      } else {
        // Fallback für unbekannte Orte - verwende Münster
        console.warn(`Unbekannter Ort: ${location}, verwende Münster als Fallback`)
        setCoordinates({ lat: 51.9607, lon: 7.6261 })
      }
    } catch (error) {
      console.error('Fehler beim Geocoding:', error)
      setCoordinates({ lat: 51.9607, lon: 7.6261 })
    }
  }

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (locationInput.trim()) {
      geocodeLocation(locationInput.trim())
    }
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    
    if (lowerCondition.includes('regen') || lowerCondition.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-600" />
    } else if (lowerCondition.includes('schnee') || lowerCondition.includes('snow')) {
      return <CloudSnow className="h-8 w-8 text-gray-400" />
    } else if (lowerCondition.includes('bewölkt') || lowerCondition.includes('bedeckt') || lowerCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    } else if (lowerCondition.includes('klar') || lowerCondition.includes('sonnig') || lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Sun className="h-8 w-8 text-yellow-500" />
    } else {
      return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getDailyForecast = (forecast: any[]) => {
    const dailyData: { [key: string]: any[] } = {}
    
    // Gruppiere Daten nach Tag
    forecast.forEach(item => {
      const date = new Date(item.date)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD Format
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = []
      }
      dailyData[dateKey].push(item)
    })

    // Sortiere die Tage und stelle sicher, dass wir 7 Tage haben
    const sortedDates = Object.keys(dailyData).sort()
    
    // Wenn wir weniger als 7 verschiedene Tage haben, erstelle zusätzliche Tage
    const today = new Date()
    const dailyResults = []
    
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + i)
      const dateKey = targetDate.toISOString().split('T')[0]
      
      if (dailyData[dateKey] && dailyData[dateKey].length > 0) {
        // Verwende echte Daten wenn verfügbar
        const dayData = dailyData[dateKey]
        const avgTemp = dayData.reduce((sum, item) => sum + item.temperature, 0) / dayData.length
        const avgHumidity = dayData.reduce((sum, item) => sum + item.humidity, 0) / dayData.length
        const totalPrecip = dayData.reduce((sum, item) => sum + item.precipitation, 0)
        
        dailyResults.push({
          date: targetDate,
          temperature: avgTemp,
          humidity: avgHumidity,
          precipitation: totalPrecip,
          condition: dayData[Math.floor(dayData.length / 2)].condition
        })
      } else {
        // Verwende den nächstbesten verfügbaren Tag als Fallback
        const fallbackData = forecast[Math.min(i * 3, forecast.length - 1)] || forecast[0]
        if (fallbackData) {
          dailyResults.push({
            date: targetDate,
            temperature: fallbackData.temperature,
            humidity: fallbackData.humidity,
            precipitation: fallbackData.precipitation,
            condition: fallbackData.condition
          })
        }
      }
    }
    
    return dailyResults.slice(0, 7)
  }
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Übersicht
        </h1>
        <p className="text-gray-600">
          Willkommen zurück, Test User! Hier ist eine Übersicht über Ihre landwirtschaftlichen Aktivitäten.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Felder</p>
              <p className="text-2xl font-bold text-gray-900">{farmStats.farms}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CloudRain className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kulturen</p>
              <p className="text-2xl font-bold text-gray-900">{farmStats.crops}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Thermometer className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temp. Heute</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '--°C' : `${Math.round(weatherData?.current.temperature || 0)}°C`}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Thermometer className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Niederschlag</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '--mm' : `${weatherData?.current.precipitation || 0}mm`}
              </p>
            </div>
            <div className="p-3 bg-cyan-100 rounded-full">
              <Droplets className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Tage Wettervorhersage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">7-Tage Wettervorhersage</h2>
          </div>
          
          <form onSubmit={handleLocationSubmit} className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-700" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Stadt eingeben (z.B. Berlin, München)"
              className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1 text-gray-800 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              Laden
            </button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-pulse">Lade Wetterdaten...</div>
          </div>
        ) : weatherData?.forecast ? (
          <div className="flex justify-between gap-2 overflow-x-auto pb-2">
            {getDailyForecast(weatherData.forecast).map((day, index) => (
              <div key={index} className="flex-1 text-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-2">
                  {day.date.toLocaleDateString('de-DE', { 
                    weekday: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="flex justify-center mb-3">
                  {getWeatherIcon(day.condition)}
                </div>
                
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {Math.round(day.temperature)}°C
                </div>
                
                <div className="text-xs text-gray-700 mb-2 font-medium leading-tight">
                  {day.condition}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Droplets className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-gray-800">{Math.round(day.humidity)}%</span>
                  </div>
                  {day.precipitation > 0 && (
                    <div className="flex items-center justify-center space-x-1">
                      <CloudRain className="h-3 w-3 text-cyan-600" />
                      <span className="text-xs font-medium text-gray-800">{Math.round(day.precipitation)}mm</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-700 font-medium">
            Keine Wetterdaten verfügbar
          </div>
        )}
      </div>

      {/* Weather Risk Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Wetterrisiken (7 Tage)</h2>
          </div>
          <div className="text-sm text-gray-600">
            {weatherRisks.length} aktive Warnungen
          </div>
        </div>
        
        {weatherRisks.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {weatherRisks.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-red-400">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{risk.dayName}</div>
                    <div className="text-xs text-gray-600">{risk.dateFormatted}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">{risk.farmName}</div>
                    <div className="text-sm text-gray-600">{risk.cropName} ({risk.cropType})</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {risk.risks.map((r: any, rIndex: number) => (
                    <div key={rIndex} className={`px-2 py-1 rounded text-xs font-medium ${
                      r.severity === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {r.type}: {r.value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-gray-600">Keine aktuellen Wetterrisiken</p>
          </div>
        )}
      </div>

      {/* Field Risk Timeline Graphs */}
      {fieldRiskGraphs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">7-Tage Risiko-Verlauf pro Feld</h2>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-300 rounded"></div>
                <span className="text-gray-600">Niedrig</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-600">Mittel</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600">Hoch</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {fieldRiskGraphs.map((field, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{field.farmName}</h3>
                    <p className="text-sm text-gray-600">{field.cropName} ({field.cropType}) • {field.farmLocation}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRiskTextColor(field.maxRisk)}`}>
                      Max: {field.maxRisk}%
                    </div>
                    <div className="text-sm text-gray-600">Ø {field.avgRisk}%</div>
                  </div>
                </div>
                
                {/* Risk Graph */}
                <div className="mb-4">
                  {/* Weekdays Header */}
                  <div className="flex items-end mb-2 h-24">
                    <div className="w-16"></div> {/* Space for y-axis labels */}
                    {field.dailyRisks.map((day: any, dayIndex: number) => (
                      <div key={dayIndex} className="flex-1 text-center">
                        <div className="text-xs font-medium text-gray-700">{day.dayName}</div>
                        <div className="text-xs text-gray-600">{day.dayNumber}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Graph Area */}
                  <div className="relative bg-gray-50 rounded-lg p-3" style={{ height: '120px' }}>
                    {/* Y-axis labels */}
                    <div className="absolute left-1 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-1">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-0 ml-12 mr-2">
                      <div className="h-full relative">
                        <div className="absolute w-full border-t border-gray-300" style={{ top: '0%' }}></div>
                        <div className="absolute w-full border-t border-gray-200" style={{ top: '25%' }}></div>
                        <div className="absolute w-full border-t border-gray-200" style={{ top: '50%' }}></div>
                        <div className="absolute w-full border-t border-gray-200" style={{ top: '75%' }}></div>
                        <div className="absolute w-full border-t border-gray-300" style={{ bottom: '0%' }}></div>
                      </div>
                    </div>
                    
                    {/* Risk Bars */}
                    <div className="flex items-end h-full ml-12 mr-2">
                      {field.dailyRisks.map((day: any, dayIndex: number) => (
                        <div key={dayIndex} className="flex-1 flex justify-center items-end h-full px-1">
                          <div className="relative w-8 h-full flex items-end">
                            <div 
                              className={`w-full rounded-t ${getRiskColor(day.riskScore)} transition-all duration-500 hover:opacity-80 cursor-pointer`}
                              style={{ height: `${Math.max(day.riskScore, 2)}%` }}
                              title={`${day.dayName}: ${day.riskScore}% Risiko\n${Math.round(day.weather.temperature)}°C${day.weather.precipitation > 0 ? `, ${day.weather.precipitation.toFixed(1)}mm` : ''}`}
                            >
                              {/* Risk percentage label on top of bar */}
                              {day.riskScore > 15 && (
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                                  {day.riskScore}%
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Weather info below */}
                  <div className="flex mt-2">
                    <div className="w-16"></div>
                    {field.dailyRisks.map((day: any, dayIndex: number) => (
                      <div key={dayIndex} className="flex-1 text-center">
                        <div className="text-xs text-gray-600">
                          {Math.round(day.weather.temperature)}°C
                          {day.weather.precipitation > 0 && (
                            <span className="text-blue-600"> • {day.weather.precipitation.toFixed(1)}mm</span>
                          )}
                        </div>
                        {day.riskScore <= 15 && (
                          <div className={`text-xs font-medium ${getRiskTextColor(day.riskScore)}`}>
                            {day.riskScore}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Risk Factors Summary */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Hauptrisiken:</span>{' '}
                    {field.dailyRisks
                      .flatMap((day: any) => day.riskFactors)
                      .reduce((acc: any[], factor: any) => {
                        const existing = acc.find(f => f.type === factor.type)
                        if (existing) {
                          existing.count++
                          existing.maxScore = Math.max(existing.maxScore, factor.score)
                        } else {
                          acc.push({ type: factor.type, count: 1, maxScore: factor.score })
                        }
                        return acc
                      }, [])
                      .sort((a: any, b: any) => b.maxScore - a.maxScore)
                      .slice(0, 3)
                      .map((factor: any) => `${factor.type} (${factor.count}x)`)
                      .join(', ') || 'Keine kritischen Risiken'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Erste Schritte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/farms"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Feld hinzufügen</h3>
            <p className="text-gray-600 text-sm">Fügen Sie Ihr erstes Feld hinzu und beginnen Sie mit der Überwachung.</p>
          </a>
          
          <a
            href="/dashboard/weather"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Wetter prüfen</h3>
            <p className="text-gray-600 text-sm">Überprüfen Sie die Wettervorhersage für optimale Erntebedingungen.</p>
          </a>
        </div>
      </div>
    </div>
  )
}