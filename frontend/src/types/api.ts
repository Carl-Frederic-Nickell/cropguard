// Shared TypeScript types for API responses

export interface Farm {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  userId: string
  createdAt: string
  crops: Crop[]
}

export interface Crop {
  id: string
  name: string
  type: string
  plantedDate: string
  farmId: string
  createdAt: string
}

export interface WeatherCurrent {
  temperature: number
  feelsLike: number
  humidity: number
  precipitationMm: number
  windSpeed: number
  condition: string
  description: string
}

export interface WeatherForecast {
  date: string
  temperature: number
  minTemp: number
  maxTemp: number
  humidity: number
  precipitation: number
  condition: string
  description: string
}

export interface HarvestRecommendation {
  cropType: string
  recommendation: 'good' | 'caution' | 'avoid'
  reason: string
  optimalTemp: {
    min: number
    max: number
  }
  optimalHumidity: {
    min: number
    max: number
  }
}

export interface WeatherRisk {
  type: 'temperature' | 'humidity' | 'precipitation' | 'wind'
  severity: 'low' | 'medium' | 'high'
  message: string
  recommendation: string
}

export interface WeatherResponse {
  location: string
  current: WeatherCurrent
  forecast: WeatherForecast[]
  harvestRecommendations: HarvestRecommendation[]
  risks: WeatherRisk[]
}

export interface ApiError {
  error: string
  message: string
  statusCode?: number
}

export interface CropStatus {
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
