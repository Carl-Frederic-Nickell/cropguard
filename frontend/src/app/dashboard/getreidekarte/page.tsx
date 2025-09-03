'use client'

import { useState, useEffect } from 'react'
import { 
  Wheat, 
  MapPin, 
  Calendar, 
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Eye,
  Sprout,
  TreePine,
  Apple,
  Circle
} from 'lucide-react'

interface CropStatus {
  id: string
  name: string
  type: string
  farm: {
    name: string
    location: string
    latitude: number
    longitude: number
  }
  plantedDate: string
  harvestStatus: 'good' | 'caution' | 'avoid'
  nextHarvestDate: string
  daysToHarvest: number
  weatherConditions: {
    temperature: number
    humidity: number
    precipitation: number
    windSpeed: number
    condition: string
  }
  harvestRecommendation: {
    status: 'good' | 'caution' | 'avoid'
    reason: string
    confidence: number
  }
  riskFactors: Array<{
    type: 'weather' | 'timing' | 'conditions'
    severity: 'low' | 'medium' | 'high'
    description: string
  }>
}

export default function GetreidekartePage() {
  const [cropStatuses, setCropStatuses] = useState<CropStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'good' | 'caution' | 'avoid'>('all')
  const [sortBy, setSortBy] = useState<'harvest' | 'risk' | 'name'>('harvest')

  const fetchCropStatuses = async () => {
    setIsLoading(true)
    try {
      // Fetch farms and crops
      const farmsResponse = await fetch('/api/farms')
      
      if (farmsResponse.ok) {
        const farms = await farmsResponse.json()
        const statuses: CropStatus[] = []
        
        for (const farm of farms) {
          for (const crop of farm.crops) {
            // Fetch weather data for each farm location
            const weatherResponse = await fetch(
              `/api/weather?lat=${farm.latitude}&lon=${farm.longitude}&cropType=${crop.type}`
            )
            
            if (weatherResponse.ok) {
              const weatherData = await weatherResponse.json()
              
              // Calculate harvest timing
              const plantedDate = new Date(crop.plantedDate)
              const harvestDate = new Date(plantedDate)
              harvestDate.setDate(harvestDate.getDate() + 90) // Default 90 days
              
              const today = new Date()
              const daysToHarvest = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              
              // Determine harvest status based on weather and timing
              let harvestStatus: 'good' | 'caution' | 'avoid' = 'good'
              let reason = 'Optimale Bedingungen für die Ernte'
              
              if (daysToHarvest < -7) {
                harvestStatus = 'avoid'
                reason = 'Ernte überfällig - Qualitätsverlust möglich'
              } else if (daysToHarvest > 21) {
                harvestStatus = 'caution'
                reason = 'Ernte noch nicht reif'
              } else if (weatherData.harvestRecommendations?.[0]) {
                harvestStatus = weatherData.harvestRecommendations[0].recommendation
                reason = weatherData.harvestRecommendations[0].reason
              }
              
              // Generate risk factors
              const riskFactors = []
              
              if (weatherData.current.precipitationMm > 2) {
                riskFactors.push({
                  type: 'weather' as const,
                  severity: 'high' as const,
                  description: `Hoher Niederschlag: ${weatherData.current.precipitationMm.toFixed(1)}mm`
                })
              }
              
              if (weatherData.current.humidity > 85) {
                riskFactors.push({
                  type: 'conditions' as const,
                  severity: 'medium' as const,
                  description: `Hohe Luftfeuchtigkeit: ${weatherData.current.humidity}%`
                })
              }
              
              if (daysToHarvest < 0) {
                riskFactors.push({
                  type: 'timing' as const,
                  severity: Math.abs(daysToHarvest) > 14 ? 'high' as const : 'medium' as const,
                  description: `Ernte ${Math.abs(daysToHarvest)} Tage überfällig`
                })
              }
              
              statuses.push({
                id: crop.id,
                name: crop.name,
                type: crop.type,
                farm: {
                  name: farm.name,
                  location: farm.location,
                  latitude: farm.latitude,
                  longitude: farm.longitude
                },
                plantedDate: crop.plantedDate,
                harvestStatus,
                nextHarvestDate: harvestDate.toISOString(),
                daysToHarvest,
                weatherConditions: {
                  temperature: weatherData.current.temperature,
                  humidity: weatherData.current.humidity,
                  precipitation: weatherData.current.precipitationMm,
                  windSpeed: weatherData.current.windSpeed,
                  condition: weatherData.current.condition
                },
                harvestRecommendation: {
                  status: harvestStatus,
                  reason,
                  confidence: Math.max(60, 100 - Math.abs(daysToHarvest) * 2)
                },
                riskFactors
              })
            }
          }
        }
        
        setCropStatuses(statuses)
      }
    } catch (error) {
      console.error('Error fetching crop statuses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'caution': return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'avoid': return <XCircle className="h-6 w-6 text-red-500" />
      default: return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200'
      case 'caution': return 'bg-yellow-50 border-yellow-200'  
      case 'avoid': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return '🟢 OPTIMAL'
      case 'caution': return '🟡 VORSICHT' 
      case 'avoid': return '🔴 RISIKO'
      default: return '❓ UNBEKANNT'
    }
  }

  const getRiskSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCropIcon = (cropType: string) => {
    const lowerType = cropType.toLowerCase()
    switch (lowerType) {
      case 'weizen':
        return <Wheat className="h-6 w-6 text-green-600" />
      case 'gerste':
        return <Wheat className="h-6 w-6 text-green-600" />
      case 'raps':
        return <Sprout className="h-6 w-6 text-green-600" />
      case 'mais':
        return <Circle className="h-6 w-6 text-green-600" />
      case 'sonnenblumen':
        return <Apple className="h-6 w-6 text-green-600" />
      case 'kartoffeln':
        return <TreePine className="h-6 w-6 text-green-600" />
      case 'zuckerrueben':
        return <TreePine className="h-6 w-6 text-green-600" />
      case 'tomaten':
        return <Apple className="h-6 w-6 text-green-600" />
      default:
        return <Wheat className="h-6 w-6 text-green-600" />
    }
  }

  const filteredAndSortedCrops = cropStatuses
    .filter(crop => selectedFilter === 'all' || crop.harvestStatus === selectedFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'harvest':
          return a.daysToHarvest - b.daysToHarvest
        case 'risk':
          const riskScore = (crop: CropStatus) => {
            const highRisk = crop.riskFactors.filter(r => r.severity === 'high').length * 3
            const mediumRisk = crop.riskFactors.filter(r => r.severity === 'medium').length * 2
            const lowRisk = crop.riskFactors.filter(r => r.severity === 'low').length * 1
            return highRisk + mediumRisk + lowRisk
          }
          return riskScore(b) - riskScore(a)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  useEffect(() => {
    fetchCropStatuses()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Getreidekarte wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Getreidekarte Status</h1>
            <p className="text-gray-600 mt-2">
              Übersicht über alle Kulturen mit Ernte-Empfehlungen und Risikoanalyse
            </p>
          </div>
          
          <button
            onClick={fetchCropStatuses}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Aktualisieren</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {cropStatuses.filter(c => c.harvestStatus === 'good').length}
            </div>
            <div className="text-sm text-gray-600">Optimal</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {cropStatuses.filter(c => c.harvestStatus === 'caution').length}
            </div>
            <div className="text-sm text-gray-600">Vorsicht</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {cropStatuses.filter(c => c.harvestStatus === 'avoid').length}
            </div>
            <div className="text-sm text-gray-600">Risiko</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {cropStatuses.filter(c => c.daysToHarvest <= 7 && c.daysToHarvest >= 0).length}
            </div>
            <div className="text-sm text-gray-600">Diese Woche</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-700" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-800 font-medium bg-white"
              >
                <option value="all">Alle Status</option>
                <option value="good">Nur Optimal</option>
                <option value="caution">Nur Vorsicht</option>
                <option value="avoid">Nur Risiko</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-800 font-medium bg-white"
            >
              <option value="harvest">Nach Erntezeit</option>
              <option value="risk">Nach Risiko</option>
              <option value="name">Nach Name</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredAndSortedCrops.length} von {cropStatuses.length} Kulturen
          </div>
        </div>
      </div>

      {/* Crop Status Cards */}
      <div className="space-y-4">
        {filteredAndSortedCrops.map((crop) => (
          <div key={crop.id} className={`bg-white rounded-lg shadow-md border-l-4 ${getStatusColor(crop.harvestStatus)}`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    {getCropIcon(crop.type)}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="capitalize">{crop.type}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {crop.farm.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(crop.harvestStatus)}
                    <span className="font-semibold text-gray-900">
                      {getStatusText(crop.harvestStatus)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Vertrauen: {crop.harvestRecommendation.confidence}%
                  </div>
                </div>
              </div>

              {/* Timing Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Nächste Ernte</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {crop.daysToHarvest <= 0 
                      ? `${Math.abs(crop.daysToHarvest)} Tage überfällig`
                      : `In ${crop.daysToHarvest} Tagen`
                    }
                  </div>
                  <div className="text-xs text-gray-700 font-medium">
                    {new Date(crop.nextHarvestDate).toLocaleDateString('de-DE')}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Thermometer className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Aktuelle Bedingungen</span>
                  </div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div>{Math.round(crop.weatherConditions.temperature)}°C, {crop.weatherConditions.humidity}%</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {crop.weatherConditions.condition}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Risikofaktoren</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {crop.riskFactors.length}
                  </div>
                  <div className="text-xs text-gray-700 font-medium">
                    {crop.riskFactors.filter(r => r.severity === 'high').length} hoch, 
                    {crop.riskFactors.filter(r => r.severity === 'medium').length} mittel
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Empfehlung</h4>
                <p className="text-sm text-gray-700">{crop.harvestRecommendation.reason}</p>
              </div>

              {/* Risk Factors */}
              {crop.riskFactors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Identifizierte Risiken</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {crop.riskFactors.map((risk, index) => (
                      <div key={index} className={`px-3 py-2 rounded-lg text-sm ${getRiskSeverityColor(risk.severity)}`}>
                        <div className="flex items-center space-x-2">
                          {risk.type === 'weather' && <CloudRain className="h-3 w-3" />}
                          {risk.type === 'timing' && <Clock className="h-3 w-3" />}
                          {risk.type === 'conditions' && <Thermometer className="h-3 w-3" />}
                          <span className="font-medium capitalize">{risk.severity}</span>
                        </div>
                        <div className="mt-1">{risk.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-800 font-medium mb-1">Temperatur</div>
                    <div className="font-bold text-gray-900">{Math.round(crop.weatherConditions.temperature)}°C</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 font-medium mb-1">Luftfeuchtigkeit</div>
                    <div className="font-bold text-gray-900">{crop.weatherConditions.humidity}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 font-medium mb-1">Niederschlag</div>
                    <div className="font-bold text-gray-900">{crop.weatherConditions.precipitation.toFixed(1)}mm</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 font-medium mb-1">Wind</div>
                    <div className="font-bold text-gray-900">{crop.weatherConditions.windSpeed.toFixed(1)} m/s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedCrops.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Kulturen gefunden
          </h3>
          <p className="text-gray-600">
            {selectedFilter === 'all' 
              ? 'Fügen Sie Kulturen hinzu, um die Getreidekarte zu sehen.'
              : `Keine Kulturen mit Status "${selectedFilter}" gefunden.`
            }
          </p>
        </div>
      )}
    </div>
  )
}