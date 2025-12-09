'use client'

import { useState, useEffect } from 'react'
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Cloud, 
  CloudSnow,
  MapPin,
  Calendar,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Sprout,
  Zap,
  Snowflake,
  CloudDrizzle
} from 'lucide-react'

interface WeatherData {
  temperature: number
  humidity: number
  precipitation: number
  precipitationMm: number
  windSpeed: number
  condition: string
  date: string
}

interface HarvestRecommendation {
  cropType: string
  recommendation: 'good' | 'caution' | 'avoid'
  reason: string
}

interface WeatherResponse {
  current: WeatherData
  forecast: WeatherData[]
  harvestRecommendations: HarvestRecommendation[]
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 51.9607,
    lon: 7.6261,
    name: 'Münster, NRW'
  })
  const [selectedCrop, setSelectedCrop] = useState('weizen')
  const [farms, setFarms] = useState<any[]>([])
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [newLocation, setNewLocation] = useState({
    name: '',
    lat: '',
    lon: ''
  })

  const cropOptions = [
    { value: 'weizen', label: 'Weizen' },
    { value: 'gerste', label: 'Gerste' },
    { value: 'raps', label: 'Raps' },
    { value: 'mais', label: 'Mais' },
    { value: 'sonnenblumen', label: 'Sonnenblumen' },
    { value: 'kartoffeln', label: 'Kartoffeln' },
    { value: 'zuckerrueben', label: 'Zuckerrüben' },
    { value: 'tomaten', label: 'Tomaten' }
  ]

  const fetchFarms = async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const data = await response.json()
        setFarms(data)
      }
    } catch (error) {
      console.error('Error fetching farms:', error)
    }
  }

  const fetchWeatherData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&cropType=${selectedCrop}`
      )
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

  const handleLocationFromFarm = (farm: any) => {
    setSelectedLocation({
      lat: farm.latitude,
      lon: farm.longitude,
      name: `${farm.name} (${farm.location})`
    })
  }

  const handleCustomLocation = () => {
    if (newLocation.name && newLocation.lat && newLocation.lon) {
      setSelectedLocation({
        lat: parseFloat(newLocation.lat),
        lon: parseFloat(newLocation.lon),
        name: newLocation.name
      })
      setNewLocation({ name: '', lat: '', lon: '' })
      setShowLocationForm(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [selectedLocation, selectedCrop])

  useEffect(() => {
    fetchFarms()
  }, [])

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('rain') || lowerCondition.includes('regen')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else if (lowerCondition.includes('snow') || lowerCondition.includes('schnee')) {
      return <CloudSnow className="h-8 w-8 text-gray-400" />
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('wolken')) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    } else {
      return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200'
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'avoid': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'good': return '🟢 Optimal'
      case 'caution': return '🟡 Vorsicht'
      case 'avoid': return '🔴 Nicht empfohlen'
      default: return '❓ Unbekannt'
    }
  }

  const formatDate = (dateString: string, index: number) => {
    const today = new Date()
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + index)

    if (index === 0) {
      return 'Heute'
    } else if (index === 1) {
      return 'Morgen'
    } else {
      return targetDate.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      })
    }
  }

  // Landwirtschaftliche Wetter-Analyse
  const analyzeWeatherConditions = (weatherData: WeatherResponse) => {
    const analysis = {
      fieldWorkSuitability: 'good' as 'good' | 'caution' | 'poor',
      sprayingConditions: 'good' as 'good' | 'caution' | 'poor',
      diseaseRisk: 'low' as 'low' | 'medium' | 'high',
      irrigationNeeded: false,
      harvestWindow: 'open' as 'open' | 'closing' | 'closed',
      summary: '',
      recommendations: [] as string[]
    }

    const current = weatherData.current
    const forecast = weatherData.forecast.slice(0, 3)

    // Feldarbeit-Eignung
    if (current.precipitationMm > 5 || current.windSpeed > 15) {
      analysis.fieldWorkSuitability = 'poor'
    } else if (current.precipitationMm > 2 || current.windSpeed > 10) {
      analysis.fieldWorkSuitability = 'caution'
    }

    // Spritzfähigkeit
    if (current.windSpeed > 8 || current.precipitationMm > 1) {
      analysis.sprayingConditions = 'poor'
    } else if (current.windSpeed > 5 || current.humidity > 85) {
      analysis.sprayingConditions = 'caution'
    }

    // Krankheitsrisiko
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length
    const hasRain = forecast.some(day => day.precipitationMm > 1)
    
    if (avgHumidity > 85 && hasRain && current.temperature > 15 && current.temperature < 25) {
      analysis.diseaseRisk = 'high'
    } else if (avgHumidity > 75 && (hasRain || current.temperature > 20)) {
      analysis.diseaseRisk = 'medium'
    }

    // Bewässerungsbedarf
    const precipitationSum = forecast.reduce((sum, day) => sum + day.precipitationMm, 0)
    if (precipitationSum < 5 && current.temperature > 25) {
      analysis.irrigationNeeded = true
    }

    // Erntefenster
    const hasHeavyRain = forecast.some(day => day.precipitationMm > 10)
    const hasStrongWind = forecast.some(day => day.windSpeed > 12)
    
    if (hasHeavyRain || hasStrongWind) {
      analysis.harvestWindow = 'closed'
    } else if (forecast.some(day => day.precipitationMm > 5)) {
      analysis.harvestWindow = 'closing'
    }

    // Empfehlungen generieren
    if (analysis.fieldWorkSuitability === 'good') {
      analysis.recommendations.push('Feldarbeiten können durchgeführt werden')
    } else if (analysis.fieldWorkSuitability === 'poor') {
      analysis.recommendations.push('Feldarbeiten vermeiden - zu nass/windig')
    }

    if (analysis.sprayingConditions === 'good') {
      analysis.recommendations.push('Gute Bedingungen für Pflanzenschutz')
    } else if (analysis.sprayingConditions === 'poor') {
      analysis.recommendations.push('Spritzarbeiten wegen Wind/Regen vermeiden')
    }

    if (analysis.diseaseRisk === 'high') {
      analysis.recommendations.push('Erhöhtes Pilzkrankheitsrisiko - Monitoring verstärken')
    }

    if (analysis.irrigationNeeded) {
      analysis.recommendations.push('Bewässerung in Erwägung ziehen')
    }

    if (analysis.harvestWindow === 'closed') {
      analysis.recommendations.push('Ernte verschieben - schlechte Bedingungen')
    } else if (analysis.harvestWindow === 'open') {
      analysis.recommendations.push('Günstige Bedingungen für die Ernte')
    }

    // Zusammenfassung
    if (analysis.fieldWorkSuitability === 'good' && analysis.sprayingConditions === 'good') {
      analysis.summary = 'Optimale Bedingungen für Feldarbeiten'
    } else if (analysis.fieldWorkSuitability === 'poor' || analysis.sprayingConditions === 'poor') {
      analysis.summary = 'Eingeschränkte Arbeitsmöglichkeiten'
    } else {
      analysis.summary = 'Mäßige Bedingungen - Vorsicht geboten'
    }

    return analysis
  }

  if (isLoading && !weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Wetterdaten werden geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CropGuard Wetter</h1>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <MapPin className="h-4 w-4" />
              <span>{selectedLocation.name}</span>
            </div>
          </div>
          <button
            onClick={fetchWeatherData}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Aktualisieren</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kultur auswählen
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium bg-white"
            >
              {cropOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standort wählen
            </label>
            <div className="flex space-x-2">
              {farms.length > 0 && (
                <select
                  onChange={(e) => {
                    const selectedFarm = farms.find(f => f.id === e.target.value)
                    if (selectedFarm) {
                      handleLocationFromFarm(selectedFarm)
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Feld auswählen...</option>
                  {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name} ({farm.location})
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setShowLocationForm(!showLocationForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Koordinaten
              </button>
            </div>
          </div>
        </div>

        {showLocationForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Benutzerdefinierte Koordinaten</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Standortname
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="z.B. Neue Farm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Breitengrad
                </label>
                <input
                  type="number"
                  step="any"
                  value={newLocation.lat}
                  onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                  placeholder="51.9607"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Längengrad
                </label>
                <input
                  type="number"
                  step="any"
                  value={newLocation.lon}
                  onChange={(e) => setNewLocation({...newLocation, lon: e.target.value})}
                  placeholder="7.6261"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleCustomLocation}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Standort verwenden
              </button>
              <button
                onClick={() => setShowLocationForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      {weatherData && (
        <>
          {/* Agricultural Weather Analysis */}
          {(() => {
            const analysis = analyzeWeatherConditions(weatherData)
            return (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Landwirtschaftliche Wetteranalyse</h2>
                  <div className="flex items-center space-x-2">
                    {analysis.summary.includes('Optimal') ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : analysis.summary.includes('Eingeschränkt') ? (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    ) : (
                      <Eye className="h-6 w-6 text-yellow-500" />
                    )}
                    <span className="font-medium text-gray-900">{analysis.summary}</span>
                  </div>
                </div>

                {/* Quick Status Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className={`inline-block p-2 rounded-full mb-2 ${
                      analysis.fieldWorkSuitability === 'good' 
                        ? 'bg-green-100' : analysis.fieldWorkSuitability === 'caution' 
                        ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Sprout className={`h-5 w-5 ${
                        analysis.fieldWorkSuitability === 'good' 
                          ? 'text-green-600' : analysis.fieldWorkSuitability === 'caution' 
                          ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="text-xs text-gray-600">Feldarbeit</div>
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.fieldWorkSuitability === 'good' ? 'Gut' : 
                       analysis.fieldWorkSuitability === 'caution' ? 'Bedingt' : 'Schlecht'}
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className={`inline-block p-2 rounded-full mb-2 ${
                      analysis.sprayingConditions === 'good' 
                        ? 'bg-green-100' : analysis.sprayingConditions === 'caution' 
                        ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <CloudDrizzle className={`h-5 w-5 ${
                        analysis.sprayingConditions === 'good' 
                          ? 'text-green-600' : analysis.sprayingConditions === 'caution' 
                          ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="text-xs text-gray-600">Spritzen</div>
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.sprayingConditions === 'good' ? 'Gut' : 
                       analysis.sprayingConditions === 'caution' ? 'Bedingt' : 'Schlecht'}
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className={`inline-block p-2 rounded-full mb-2 ${
                      analysis.diseaseRisk === 'low' 
                        ? 'bg-green-100' : analysis.diseaseRisk === 'medium' 
                        ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <AlertTriangle className={`h-5 w-5 ${
                        analysis.diseaseRisk === 'low' 
                          ? 'text-green-600' : analysis.diseaseRisk === 'medium' 
                          ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="text-xs text-gray-600">Krankheitsrisiko</div>
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.diseaseRisk === 'low' ? 'Niedrig' : 
                       analysis.diseaseRisk === 'medium' ? 'Mittel' : 'Hoch'}
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className={`inline-block p-2 rounded-full mb-2 ${
                      analysis.irrigationNeeded ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Droplets className={`h-5 w-5 ${
                        analysis.irrigationNeeded ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="text-xs text-gray-600">Bewässerung</div>
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.irrigationNeeded ? 'Nötig' : 'Nicht nötig'}
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className={`inline-block p-2 rounded-full mb-2 ${
                      analysis.harvestWindow === 'open' 
                        ? 'bg-green-100' : analysis.harvestWindow === 'closing' 
                        ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        analysis.harvestWindow === 'open' 
                          ? 'text-green-600' : analysis.harvestWindow === 'closing' 
                          ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="text-xs text-gray-600">Erntefenster</div>
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.harvestWindow === 'open' ? 'Offen' : 
                       analysis.harvestWindow === 'closing' ? 'Schließend' : 'Geschlossen'}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Handlungsempfehlungen
                    </h3>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Current Weather - Compact */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Aktuelle Bedingungen</h2>
              <div className="flex items-center space-x-2">
                {getWeatherIcon(weatherData.current.condition)}
                <span className="text-lg text-gray-700 capitalize">
                  {weatherData.current.condition}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Thermometer className="h-6 w-6 text-red-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(weatherData.current.temperature)}°C
                  </span>
                </div>
                <p className="text-sm text-gray-600">Temperatur</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {weatherData.current.humidity}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">Luftfeuchtigkeit</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CloudRain className="h-6 w-6 text-cyan-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {weatherData.current.precipitationMm.toFixed(1)}mm
                  </span>
                </div>
                <p className="text-sm text-gray-600">Niederschlag</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Wind className="h-6 w-6 text-gray-700 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {weatherData.current.windSpeed.toFixed(1)} m/s
                  </span>
                </div>
                <p className="text-sm text-gray-600">Wind</p>
              </div>
            </div>

            {/* Current Harvest Recommendation */}
            {weatherData.harvestRecommendations.length > 0 && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ernte-Empfehlung für {cropOptions.find(c => c.value === selectedCrop)?.label}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm border ${
                  getRecommendationColor(weatherData.harvestRecommendations[0].recommendation)
                }`}>
                  {getRecommendationText(weatherData.harvestRecommendations[0].recommendation)}
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {weatherData.harvestRecommendations[0].reason}
                </p>
              </div>
            )}
          </div>

          {/* Today/Tomorrow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weatherData.forecast.slice(0, 2).map((weather, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {index === 0 ? 'Heute' : 'Morgen'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(weather.condition)}
                    <span className="text-sm text-gray-600 capitalize">
                      {weather.condition}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Temperatur</p>
                    <p className="font-semibold">{Math.round(weather.temperature)}°C</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Luftfeuchtigkeit</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Niederschlag</p>
                    <p className="font-semibold">{weather.precipitationMm.toFixed(1)}mm</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Wind</p>
                    <p className="font-semibold">{weather.windSpeed.toFixed(1)} m/s</p>
                  </div>
                </div>

                {weatherData.harvestRecommendations[index] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className={`inline-block px-2 py-1 rounded text-xs border ${
                      getRecommendationColor(weatherData.harvestRecommendations[index].recommendation)
                    }`}>
                      {getRecommendationText(weatherData.harvestRecommendations[index].recommendation)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7-Tage Wettertrend</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {weatherData.forecast.slice(0, 7).map((weather, index) => {
                const analysis = analyzeWeatherConditions({...weatherData, current: weather, forecast: [weather]})
                return (
                  <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {formatDate(weather.date, index)}
                    </div>
                    
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(weather.condition)}
                    </div>
                    
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {Math.round(weather.temperature)}°C
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      <div className="flex items-center justify-center">
                        <Droplets className="h-3 w-3 mr-1" />
                        {weather.humidity}%
                      </div>
                      <div className="flex items-center justify-center">
                        <CloudRain className="h-3 w-3 mr-1" />
                        {weather.precipitationMm.toFixed(1)}mm
                      </div>
                      <div className="flex items-center justify-center">
                        <Wind className="h-3 w-3 mr-1" />
                        {weather.windSpeed.toFixed(1)} m/s
                      </div>
                    </div>

                    {/* Field Work Indicator */}
                    <div className="flex justify-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        analysis.fieldWorkSuitability === 'good' 
                          ? 'bg-green-500' : analysis.fieldWorkSuitability === 'caution' 
                          ? 'bg-yellow-500' : 'bg-red-500'
                      }`} title="Feldarbeit"></div>
                      <div className={`w-2 h-2 rounded-full ${
                        analysis.sprayingConditions === 'good' 
                          ? 'bg-green-500' : analysis.sprayingConditions === 'caution' 
                          ? 'bg-yellow-500' : 'bg-red-500'
                      }`} title="Spritzen"></div>
                      <div className={`w-2 h-2 rounded-full ${
                        analysis.harvestWindow === 'open' 
                          ? 'bg-green-500' : analysis.harvestWindow === 'closing' 
                          ? 'bg-yellow-500' : 'bg-red-500'
                      }`} title="Ernte"></div>
                    </div>

                    {weatherData.harvestRecommendations[index] && (
                      <div className="mt-2">
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          weatherData.harvestRecommendations[index].recommendation === 'good' 
                            ? 'bg-green-500' 
                            : weatherData.harvestRecommendations[index].recommendation === 'caution'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`} title={weatherData.harvestRecommendations[index].reason}></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-center">
                <span className="font-medium">Indikatoren:</span>
                <span className="inline-flex items-center ml-4 space-x-4">
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    Feldarbeit
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    Spritzen
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    Ernte
                  </span>
                  <span className="ml-4">🟢 Gut • 🟡 Bedingt • 🔴 Schlecht</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}