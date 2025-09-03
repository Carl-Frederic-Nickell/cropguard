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
  Plus
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Heute'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen'
    } else {
      return date.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      })
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Wetter Dashboard</h1>
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
          {/* Current Weather */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktuelles Wetter</h2>
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
                <p className="text-sm text-gray-600">Windgeschwindigkeit</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                {getWeatherIcon(weatherData.current.condition)}
                <span className="text-lg text-gray-700 capitalize">
                  {weatherData.current.condition}
                </span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7-Tage Vorhersage</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {weatherData.forecast.slice(0, 7).map((weather, index) => (
                <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {formatDate(weather.date)}
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(weather.condition)}
                  </div>
                  
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {Math.round(weather.temperature)}°C
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>{weather.humidity}%</div>
                    <div>{weather.precipitationMm.toFixed(1)}mm</div>
                    <div>{weather.windSpeed.toFixed(1)} m/s</div>
                  </div>

                  {weatherData.harvestRecommendations[index] && (
                    <div className="mt-2">
                      <div className={`w-3 h-3 rounded-full mx-auto ${
                        weatherData.harvestRecommendations[index].recommendation === 'good' 
                          ? 'bg-green-500' 
                          : weatherData.harvestRecommendations[index].recommendation === 'caution'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}