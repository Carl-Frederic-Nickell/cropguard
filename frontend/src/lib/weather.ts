import axios from 'axios'

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
  temperature: number
  humidity: number
  precipitation: number
  precipitationMm: number
  windSpeed: number
  condition: string
  date: string
}

export interface HarvestRecommendation {
  cropType: string
  recommendation: 'good' | 'caution' | 'avoid'
  reason: string
  confidence: number
  nextOptimalDate?: string
  riskFactors: Array<{
    type: 'weather' | 'timing' | 'conditions'
    severity: 'low' | 'medium' | 'high'
    description: string
  }>
  harvestAdvice: string
  moistureLimit: number
  isFieldMoisture: boolean
}

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'de'
    }
  })

  const data = response.data
  const precipitationMm = (data.rain?.['1h'] || 0) + (data.snow?.['1h'] || 0)

  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    precipitation: data.rain?.['1h'] || 0,
    precipitationMm,
    windSpeed: data.wind.speed,
    condition: data.weather[0].description,
    date: new Date().toISOString()
  }
}

export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherData[]> => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'de'
    }
  })

  return response.data.list.slice(0, 21).map((item: any) => {
    const precipitationMm = (item.rain?.['3h'] || 0) + (item.snow?.['3h'] || 0)
    return {
      temperature: item.main.temp,
      humidity: item.main.humidity,
      precipitation: item.rain?.['3h'] || 0,
      precipitationMm,
      windSpeed: item.wind.speed,
      condition: item.weather[0].description,
      date: item.dt_txt
    }
  })
}

export const getHarvestRecommendation = (
  weather: WeatherData,
  cropType: string,
  forecastData?: WeatherData[]
): HarvestRecommendation => {
  const { temperature, humidity, precipitationMm, windSpeed } = weather

  const cropCriteria: Record<string, any> = {
    weizen: {
      minTemp: 22, maxTemp: 26, maxHumidity: 60, maxPrecip: 1.5, maxWind: 8,
      harvestDuration: 120, optimalWindow: 14,
      harvestComment: "Unter 18% Kornfeuchte, sonst Gefahr von Lager- und Qualitätsverlusten",
      moistureLimit: 18
    },
    gerste: {
      minTemp: 18, maxTemp: 24, maxHumidity: 17, maxPrecip: 1.0, maxWind: 10,
      harvestDuration: 110, optimalWindow: 12,
      harvestComment: "Malzqualität leidet bei zu hoher Feuchtigkeit",
      moistureLimit: 17
    },
    raps: {
      minTemp: 20, maxTemp: 25, maxHumidity: 40, maxPrecip: 0.5, maxWind: 12,
      harvestDuration: 90, optimalWindow: 10,
      harvestComment: "Sehr empfindlich, zu feucht = Auswuchsgefahr",
      moistureLimit: 40
    },
    mais: {
      minTemp: 15, maxTemp: 30, maxHumidity: 20, maxPrecip: 1.0, maxWind: 15,
      harvestDuration: 100, optimalWindow: 21,
      harvestComment: "Bei zu hoher Luftfeuchte steigt Schimmelrisiko",
      moistureLimit: 20
    },
    kartoffeln: {
      minTemp: 10, maxTemp: 18, maxHumidity: 75, maxPrecip: 2.0, maxWind: 10,
      harvestDuration: 80, optimalWindow: 30,
      harvestComment: "Schalenfestigkeit wichtig, zu heiß = Fäulnisrisiko",
      moistureLimit: 75,
      isFieldMoisture: true
    },
    zuckerrueben: {
      minTemp: 8, maxTemp: 15, maxHumidity: 80, maxPrecip: 1.5, maxWind: 12,
      harvestDuration: 180, optimalWindow: 21,
      harvestComment: "Müssen kühl geerntet werden, sonst Lagerverluste",
      moistureLimit: 80,
      isFieldMoisture: true
    },
    sonnenblumen: {
      minTemp: 22, maxTemp: 28, maxHumidity: 15, maxPrecip: 0.5, maxWind: 8,
      harvestDuration: 120, optimalWindow: 14,
      harvestComment: "Ölqualität sinkt bei zu hoher Kornfeuchte",
      moistureLimit: 15
    },
    tomaten: {
      minTemp: 15, maxTemp: 28, maxHumidity: 80, maxPrecip: 1, maxWind: 8,
      harvestDuration: 75, optimalWindow: 14,
      harvestComment: "Empfindlich gegen Nässe und starke Temperaturschwankungen",
      moistureLimit: 80
    }
  }

  const criteria = cropCriteria[cropType.toLowerCase()] || cropCriteria.weizen

  let recommendation: 'good' | 'caution' | 'avoid' = 'good'
  const reasons: string[] = []
  const riskFactors: Array<{type: 'weather' | 'timing' | 'conditions', severity: 'low' | 'medium' | 'high', description: string}> = []
  let confidence = 100

  // Temperature analysis
  if (temperature < criteria.minTemp) {
    const severity = temperature < criteria.minTemp - 5 ? 'high' : 'medium'
    recommendation = severity === 'high' ? 'avoid' : 'caution'
    reasons.push(`Temperatur zu niedrig (${temperature}°C)`)
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Temperatur ${temperature}°C unter Optimal (${criteria.minTemp}-${criteria.maxTemp}°C)`
    })
    confidence -= severity === 'high' ? 30 : 15
  } else if (temperature > criteria.maxTemp) {
    const severity = temperature > criteria.maxTemp + 5 ? 'high' : 'medium'
    recommendation = severity === 'high' ? 'avoid' : 'caution'
    reasons.push(`Temperatur zu hoch (${temperature}°C)`)
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Temperatur ${temperature}°C über Optimal (${criteria.minTemp}-${criteria.maxTemp}°C)`
    })
    confidence -= severity === 'high' ? 30 : 15
  }

  // Humidity analysis
  if (humidity > criteria.maxHumidity) {
    const severity = humidity > criteria.maxHumidity + 15 ? 'high' : humidity > criteria.maxHumidity + 5 ? 'medium' : 'low'
    if (severity === 'high') recommendation = 'avoid'
    else if (severity === 'medium' && recommendation === 'good') recommendation = 'caution'

    reasons.push(`Luftfeuchtigkeit zu hoch (${humidity}%)`)
    riskFactors.push({
      type: 'conditions',
      severity,
      description: `Luftfeuchtigkeit ${humidity}% über Grenzwert (max ${criteria.maxHumidity}%)`
    })
    confidence -= severity === 'high' ? 25 : severity === 'medium' ? 10 : 5
  }

  // Precipitation analysis
  if (precipitationMm > criteria.maxPrecip) {
    const severity = precipitationMm > criteria.maxPrecip * 2 ? 'high' : 'medium'
    recommendation = 'avoid'
    reasons.push(`Zu viel Niederschlag (${precipitationMm.toFixed(1)}mm)`)
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Niederschlag ${precipitationMm.toFixed(1)}mm über Grenzwert (max ${criteria.maxPrecip}mm)`
    })
    confidence -= severity === 'high' ? 40 : 25
  }

  // Wind analysis
  if (windSpeed > criteria.maxWind) {
    const severity = windSpeed > criteria.maxWind + 5 ? 'high' : 'medium'
    if (severity === 'high') recommendation = 'avoid'
    else if (recommendation === 'good') recommendation = 'caution'

    reasons.push(`Wind zu stark (${windSpeed.toFixed(1)}m/s)`)
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Windgeschwindigkeit ${windSpeed.toFixed(1)}m/s über Grenzwert (max ${criteria.maxWind}m/s)`
    })
    confidence -= severity === 'high' ? 20 : 10
  }

  // Calculate next optimal harvest date based on forecast
  let nextOptimalDate: string | undefined
  if (forecastData && recommendation !== 'good') {
    const optimalForecast = forecastData.find((day, index) => {
      if (index === 0) return false
      const dayRecommendation = getHarvestRecommendation(day, cropType)
      return dayRecommendation.recommendation === 'good'
    })

    if (optimalForecast) {
      nextOptimalDate = optimalForecast.date
    }
  }

  confidence = Math.max(0, Math.min(100, confidence))

  let harvestAdvice = criteria.harvestComment
  if (recommendation !== 'good') {
    harvestAdvice = `${criteria.harvestComment} - ${reasons.join(', ')}`
  }

  return {
    cropType,
    recommendation,
    reason: reasons.length > 0 ? reasons.join(', ') : `Optimale Bedingungen für die Ernte. ${criteria.harvestComment}`,
    confidence,
    nextOptimalDate,
    riskFactors,
    harvestAdvice,
    moistureLimit: criteria.moistureLimit,
    isFieldMoisture: criteria.isFieldMoisture || false
  }
}
