'use client'

import { useState, useEffect } from 'react'
import { CloudRain, Thermometer, Droplets, Wind, Calendar, MapPin, Sun, Cloud, CloudSnow, AlertTriangle, XCircle, Clock, Wheat, Sprout, TreePine, Apple, Circle, X, Map } from 'lucide-react'

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
  const [showFirstSteps, setShowFirstSteps] = useState(true)
  const [selectedCropTypes, setSelectedCropTypes] = useState<string[]>([])
  const [availableCropTypes, setAvailableCropTypes] = useState<string[]>([])
  const [showAllWarnings, setShowAllWarnings] = useState(true)

  // Calculate humidity risk with context for German agriculture
  const calculateHumidityRisk = (humidity: number, date: Date, cropType: string) => {
    const month = date.getMonth() + 1 // 1-12
    const isWinter = month >= 11 || month <= 2
    const isSpring = month >= 3 && month <= 5
    const isSummer = month >= 6 && month <= 8
    const isAutumn = month >= 9 && month <= 10
    
    // Crop-specific humidity tolerances
    const cropTolerances: { [key: string]: { critical: number, warning: number } } = {
      'weizen': { critical: 95, warning: 88 },
      'gerste': { critical: 95, warning: 88 },
      'raps': { critical: 92, warning: 85 },
      'mais': { critical: 96, warning: 90 },
      'sonnenblumen': { critical: 90, warning: 82 }
    }
    
    const tolerance = cropTolerances[cropType.toLowerCase()] || { critical: 93, warning: 85 }
    
    // Base risk assessment
    let riskScore = 0
    let riskType = 'Feuchtigkeit'
    let info = ''
    let recommendation = ''
    
    if (humidity >= tolerance.critical) {
      // Critical humidity levels
      riskScore = Math.min(35, (humidity - tolerance.critical) * 5 + 25)
      riskType = 'Kritische Feuchtigkeit'
      
      if (isWinter) {
        info = 'Sehr hohe Feuchtigkeit im Winter - typisch aber problematisch für Lagergetreide'
        recommendation = 'Lagergetreide auf Schimmelbefall prüfen, Belüftung sicherstellen'
      } else if (isSpring || isAutumn) {
        info = 'Kritische Feuchtigkeit - erhöhtes Pilzkrankheitsrisiko'
        recommendation = 'Fungizid-Behandlung prüfen, Feldbegehung für Pilzkrankheiten'
      } else {
        info = 'Sehr hohe Sommerfeuchtigkeit - Pilzkrankheiten und Schädlingsrisiko'
        recommendation = 'Sofortige Feldkontrolle, evtl. Behandlung erforderlich'
      }
    } else if (humidity >= tolerance.warning) {
      // Elevated humidity levels
      riskScore = Math.min(20, (humidity - tolerance.warning) * 2.5)
      riskType = 'Erhöhte Feuchtigkeit'
      
      if (isWinter) {
        info = 'Normale Winterfeuchtigkeit - für Vegetation unkritisch'
        recommendation = 'Routine-Überwachung ausreichend'
      } else if (isSpring) {
        info = 'Frühjahrsfeuchtigkeit begünstigt Pilzkrankheiten'
        recommendation = 'Präventive Maßnahmen gegen Pilzkrankheiten erwägen'
      } else if (isSummer) {
        info = 'Hohe Sommerfeuchtigkeit - Pilzkrankheitsrisiko'
        recommendation = 'Feldbegehung für Krankheitssymptome'
      } else {
        info = 'Herbstfeuchtigkeit - normal aber Erntequalität beachten'
        recommendation = 'Erntequalität und Trocknungsbedarf prüfen'
      }
    }
    
    return {
      score: riskScore,
      type: riskType,
      info,
      recommendation
    }
  }

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
                    
                    // Improved humidity risk with context
                    const humidityRisk = calculateHumidityRisk(day.humidity, date, crop.type)
                    if (humidityRisk.score > 0) {
                      riskFactors.push({
                        type: humidityRisk.type,
                        severity: humidityRisk.score > 25 ? 'high' : 'medium',
                        value: `${day.humidity}%`,
                        info: humidityRisk.info,
                        recommendation: humidityRisk.recommendation
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
        
        setWeatherRisks(risks) // Keep all risks for filtering
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
                  
                  // Improved humidity risk with context
                  const humidityRisk = calculateHumidityRisk(dayData.humidity, date, crop.type)
                  if (humidityRisk.score > 0) {
                    riskScore += humidityRisk.score
                    riskFactors.push({ 
                      type: humidityRisk.type, 
                      score: humidityRisk.score, 
                      value: `${dayData.humidity}%`,
                      info: humidityRisk.info,
                      recommendation: humidityRisk.recommendation
                    })
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
        
        // Extract unique crop types
        const uniqueCropTypes = [...new Set(fieldGraphs.map(field => field.cropType))]
        setAvailableCropTypes(uniqueCropTypes)
        
        // Set all crops as selected by default if none are selected
        if (selectedCropTypes.length === 0) {
          setSelectedCropTypes(uniqueCropTypes)
        }
        
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

  const getCropIcon = (cropType: string) => {
    const lowerType = cropType.toLowerCase()
    switch (lowerType) {
      case 'weizen': return <Wheat className="h-5 w-5" />
      case 'gerste': return <Wheat className="h-5 w-5" />
      case 'raps': return <Sprout className="h-5 w-5" />
      case 'mais': return <Circle className="h-5 w-5" />
      case 'sonnenblumen': return <Apple className="h-5 w-5" />
      case 'kartoffeln': return <TreePine className="h-5 w-5" />
      case 'zuckerrueben': return <TreePine className="h-5 w-5" />
      case 'tomaten': return <Apple className="h-5 w-5" />
      default: return <Wheat className="h-5 w-5" />
    }
  }

  const getStatusBadge = (avgRisk: number) => {
    if (avgRisk <= 15) return { text: 'Optimal', color: 'bg-green-500 text-white' }
    if (avgRisk <= 40) return { text: 'Akzeptabel', color: 'bg-yellow-500 text-white' }
    return { text: 'Problematisch', color: 'bg-red-500 text-white' }
  }

  const getIntelligentHarvestAdvice = (cropType: string, currentWeather: any, criteria: any) => {
    const temp = currentWeather.temperature || 0
    const humidity = currentWeather.humidity || 0
    
    // Calculate deltas
    const tempInRange = temp >= criteria.minTemp && temp <= criteria.maxTemp
    const humidityOK = humidity <= criteria.maxHumidity
    const tempDelta = tempInRange ? 0 : (temp < criteria.minTemp ? criteria.minTemp - temp : temp - criteria.maxTemp)
    const humidityDelta = humidityOK ? 0 : humidity - criteria.maxHumidity
    
    // Get current season/month for harvest timing
    const now = new Date()
    const month = now.getMonth() + 1 // 1-12
    
    // Harvest timing by crop type (simplified for demo)
    const harvestMonths: Record<string, number[]> = {
      weizen: [7, 8, 9], // Juli-September
      gerste: [6, 7, 8], // Juni-August
      raps: [7, 8], // Juli-August
      mais: [9, 10, 11], // September-November
      kartoffeln: [8, 9, 10], // August-Oktober
      zuckerrueben: [10, 11], // Oktober-November
    }

    const cropMonths = harvestMonths[cropType.toLowerCase()] || [8, 9]
    const isHarvestSeason = cropMonths.includes(month)
    
    // Generate intelligent advice
    if (tempInRange && humidityOK && isHarvestSeason) {
      return {
        type: 'optimal',
        icon: '🟢',
        title: 'Perfekte Erntebedingungen!',
        advice: `Alle Parameter im optimalen Bereich. Jetzt ernten für beste Qualität und minimale Lagerverluste.`
      }
    }
    
    if (!isHarvestSeason) {
      const nextSeason = cropMonths[0] > month ? `${cropMonths[0]}.` : `${cropMonths[0]} (nächstes Jahr)`
      return {
        type: 'timing',
        icon: '📅',
        title: 'Erntezeitpunkt beachten',
        advice: `${cropType} wird normalerweise zwischen ${cropMonths.join('-')}. Monat geerntet. Nächste Erntezeit: ${nextSeason}`
      }
    }
    
    if (!tempInRange && !humidityOK) {
      return {
        type: 'critical',
        icon: '🔴',
        title: 'Kritische Bedingungen',
        advice: `Temperatur ${tempDelta.toFixed(1)}°C ${temp > criteria.maxTemp ? 'zu hoch' : 'zu niedrig'}, Feuchtigkeit ${humidityDelta.toFixed(1)}% über Limit. Ernte verschieben bis sich Bedingungen verbessern.`
      }
    }
    
    if (!tempInRange) {
      const tempAdvice = temp > criteria.maxTemp 
        ? `${tempDelta.toFixed(1)}°C zu warm - Vormittags oder Abends ernten`
        : `${tempDelta.toFixed(1)}°C zu kalt - Mittagsernte abwarten`
      
      return {
        type: 'temperature',
        icon: '🟡',
        title: 'Temperatur suboptimal',
        advice: tempAdvice + '. Feuchtigkeit ist OK.'
      }
    }
    
    if (!humidityOK) {
      return {
        type: 'humidity',
        icon: '🟡', 
        title: 'Feuchtigkeit zu hoch',
        advice: `${humidityDelta.toFixed(1)}% über Limit. Warten auf trockenere Bedingungen oder erhöhte Trocknungskosten einkalkulieren.`
      }
    }
    
    return {
      type: 'acceptable',
      icon: '🟡',
      title: 'Akzeptable Bedingungen', 
      advice: 'Ernte möglich, aber nicht optimal. Lagerung und Qualität überwachen.'
    }
  }

  const getCropCriteria = (cropType: string) => {
    const lowerType = cropType.toLowerCase()
    switch (lowerType) {
      case 'weizen':
        return { minTemp: 22, maxTemp: 26, maxHumidity: 60 }
      case 'gerste':
        return { minTemp: 18, maxTemp: 24, maxHumidity: 17 }
      case 'raps':
        return { minTemp: 20, maxTemp: 25, maxHumidity: 40 }
      case 'mais':
        return { minTemp: 15, maxTemp: 30, maxHumidity: 20 }
      case 'kartoffeln':
        return { minTemp: 10, maxTemp: 18, maxHumidity: 75 }
      case 'zuckerrueben':
        return { minTemp: 8, maxTemp: 15, maxHumidity: 80 }
      default:
        return { minTemp: 15, maxTemp: 25, maxHumidity: 70 }
    }
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
          CropGuard Dashboard
        </h1>
        {(() => {
          // Dynamische Willkommensnachrichten mit landwirtschaftlichen Fakten
          const dailyMessages = [
            "Wussten Sie, dass ein Weizenkorn bis zu 20 neue Pflanzen hervorbringen kann? Eine kleine Investition mit großer Wirkung!",
            "Heute perfektes Wetter für die Feldarbeit? Denken Sie daran: Der beste Boden ist wie ein guter Freund - er braucht Pflege und Aufmerksamkeit.",
            "Landwirtschaftlicher Tipp: Regenwürmer sind die unbesungenen Helden Ihrer Felder - sie produzieren täglich ihr eigenes Gewicht an wertvollen Wurmkot!",
            "Interessant: Mais kann bis zu 2 Meter pro Woche wachsen! Kein Wunder, dass Landwirte sagen: 'Man kann ihm beim Wachsen zusehen.'",
            "Nachhaltigkeit zahlt sich aus: Fruchtfolgen können den Ertrag um bis zu 30% steigern und gleichzeitig den Boden schützen.",
            "Wetterfakt: Die optimale Temperatur für Getreidewachstum liegt zwischen 15-25°C. Ihre Pflanzen sind echte Goldlöckchen!",
            "Precision Farming wird immer wichtiger: Drohnen können heute Pflanzenschäden bis auf wenige Zentimeter genau lokalisieren.",
            "Herbst-Weisheit: Jetzt ist die beste Zeit für Bodenproben - der Boden verrät Ihnen seine Geheimnisse für die nächste Saison!",
            "Faszinierend: Ein Hektar Raps kann so viel Sauerstoff produzieren wie 60 Menschen pro Jahr verbrauchen. Echte Naturhelden!",
            "Bodenschutz-Tipp: Zwischenfruchtanbau kann Erosion um bis zu 90% reduzieren. Kleine Pflanzen, große Wirkung!",
            "Innovation: Moderne GPS-Systeme ermöglichen Parallelfahrten mit nur 2cm Abweichung - Präzision auf höchstem Niveau!",
            "Biodiversität: Ein gesundes Feld beherbergt über 1000 verschiedene Arten - von Mikroorganismen bis zu Vögeln.",
            "Märkte im Blick: Getreidepreise schwanken oft saisonal - der Herbst kann goldene Chancen bieten!",
            "Klimawandel-Anpassung: Trockenresistente Sorten können Erträge auch in schwierigen Jahren sichern.",
            "Technologie-Trend: Smart Farming Apps können den Düngemitteleinsatz um bis zu 20% optimieren!"
          ]
          
          // Basiert auf dem aktuellen Tag des Jahres für konsistente tägliche Nachrichten
          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
          const todaysMessage = dailyMessages[dayOfYear % dailyMessages.length]
          
          return (
            <div>
              <p className="text-gray-600 mb-3">
                Willkommen zurück, Carl! Hier ist eine Übersicht über Ihre landwirtschaftlichen Aktivitäten.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Täglicher Landwirtschafts-Tipp</h3>
                    <p className="text-sm text-green-700 mt-1">{todaysMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Felder</p>
              <p className="text-2xl font-bold text-gray-900">{farmStats.farms}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Map className="h-6 w-6 text-green-600" />
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
              <Sprout className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Niederschlag (aktuell)</p>
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

      {/* Erste Schritte - Closeable */}
      {showFirstSteps && (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-gray-900">Erste Schritte</h2>
            <button 
              onClick={() => setShowFirstSteps(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
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
      )}

      {/* 7-Tage Wettervorhersage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg text-gray-900">7-Tage Wettervorhersage</h2>
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
                <div className="text-sm text-gray-800 mb-2">
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
            <h2 className="text-lg text-gray-900">Wetterrisiken (7 Tage)</h2>
          </div>
          <div className="text-sm text-gray-600">
            {weatherRisks
              .filter(risk => selectedCropTypes.length === 0 || selectedCropTypes.includes(risk.cropType))
              .filter(risk => showAllWarnings || risk.risks.some((r: any) => r.severity === 'high'))
              .length} aktive Warnungen
          </div>
        </div>
        
        {weatherRisks
          .filter(risk => selectedCropTypes.length === 0 || selectedCropTypes.includes(risk.cropType))
          .filter(risk => showAllWarnings || risk.risks.some((r: any) => r.severity === 'high'))
          .slice(0, 10)
          .length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {weatherRisks
              .filter(risk => selectedCropTypes.length === 0 || selectedCropTypes.includes(risk.cropType))
              .filter(risk => showAllWarnings || risk.risks.some((r: any) => r.severity === 'high'))
              .slice(0, 10)
              .map((risk, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 min-h-[120px] w-full ${
                risk.risks.some((r: any) => r.severity === 'high') 
                  ? 'bg-red-100 border-red-500' 
                  : 'bg-yellow-100 border-yellow-500'
              }`}>
                <div className="grid grid-cols-2 gap-4 h-full">
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
                  
                  <div className="flex flex-col gap-2">
                    {risk.risks.map((r: any, rIndex: number) => (
                      <div key={rIndex} className="p-2 rounded border bg-white">
                        <div className="font-semibold text-sm text-gray-900">
                          {r.type}: {r.value}
                        </div>
                        {r.info && (
                          <div className="text-xs mt-1 text-gray-700">
                            {r.info}
                          </div>
                        )}
                        {r.recommendation && (
                          <div className="text-xs mt-1 font-semibold text-gray-900">
                            💡 {r.recommendation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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

      {/* Field Risk Cards - Screenshot Style */}
      {fieldRiskGraphs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg text-gray-900">7-Tage Ernte-Analyse pro Feld</h2>
            </div>
          </div>
          
          {/* Crop Filter Menu */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Filter nach Kulturen:</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showAllWarnings}
                    onChange={(e) => setShowAllWarnings(e.target.checked)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Alle Warnungen anzeigen</span>
                </label>
                <button
                  onClick={() => setSelectedCropTypes(availableCropTypes)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Alle auswählen
                </button>
                <button
                  onClick={() => setSelectedCropTypes([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Alle abwählen
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCropTypes.map((cropType) => {
                const isSelected = selectedCropTypes.includes(cropType)
                return (
                  <label
                    key={cropType}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-green-100 border-2 border-green-500 text-green-700'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCropTypes([...selectedCropTypes, cropType])
                        } else {
                          setSelectedCropTypes(selectedCropTypes.filter(t => t !== cropType))
                        }
                      }}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="flex items-center space-x-1">
                      {getCropIcon(cropType)}
                      <span className="font-medium capitalize">{cropType}</span>
                    </span>
                  </label>
                )
              })}
            </div>
            {selectedCropTypes.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                {selectedCropTypes.length === availableCropTypes.length
                  ? 'Alle Kulturen ausgewählt'
                  : `${selectedCropTypes.length} von ${availableCropTypes.length} Kulturen ausgewählt`
                }
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {fieldRiskGraphs
              .filter(field => selectedCropTypes.includes(field.cropType))
              .filter(field => showAllWarnings || field.maxRisk > 0)
              .map((field, index) => {
              const status = getStatusBadge(field.avgRisk)
              const criteria = getCropCriteria(field.cropType)
              const currentWeather = field.dailyRisks[0]?.weather || {}
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4" 
                     style={{ borderLeftColor: status.text === 'Optimal' ? '#10b981' : status.text === 'Akzeptabel' ? '#f59e0b' : '#ef4444' }}>
                  {/* Header */}
                  <div className="p-4" style={{ 
                    background: status.text === 'Optimal' ? '#10b981' : status.text === 'Akzeptabel' ? '#f59e0b' : '#ef4444' 
                  }}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2">
                        {getCropIcon(field.cropType)}
                        <span className="font-semibold capitalize">{field.cropType}</span>
                      </div>
                      <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-4 py-2 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm " style={{color: '#000000'}}>Status:</span>
                      <span className={`text-sm px-2 py-1 rounded ${status.color}`}>{status.text}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Farm Info */}
                    <div className="mb-4">
                      <h3 className="text-gray-900">{field.farmName}</h3>
                      <p className="text-sm text-gray-600">{field.cropName} • {field.farmLocation}</p>
                    </div>
                    
                    {/* Optimal Conditions */}
                    <div className="mb-4">
                      <div className="mb-3">
                        <span className="text-sm " style={{color: '#000000'}}>Optimale Bedingungen vs. Ist-Werte:</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Luftfeuchtigkeit */}
                        <div className="space-y-2">
                          <div className="text-xs  mb-1" style={{color: '#000000'}}>Luftfeuchtigkeit</div>
                          
                          {/* Soll-Wert */}
                          <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
                            <div className="text-xs " style={{color: '#000000'}}>Soll-Wert:</div>
                            <div className="" style={{color: '#000000'}}>≤ {criteria.maxHumidity}%</div>
                          </div>
                          
                          {/* Ist-Wert */}
                          <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1">
                            <div className="text-xs " style={{color: '#000000'}}>Ist-Wert:</div>
                            <div className="" style={{color: '#000000'}}>{Math.round(currentWeather.humidity || 0)}%</div>
                          </div>
                          
                          {/* Delta */}
                          <div className={`border rounded px-2 py-1 ${
                            (currentWeather.humidity || 0) <= criteria.maxHumidity 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="text-xs " style={{color: '#000000'}}>Delta:</div>
                            <div className="" style={{color: '#000000'}}>
                              {(currentWeather.humidity || 0) <= criteria.maxHumidity 
                                ? `✓ ${criteria.maxHumidity - Math.round(currentWeather.humidity || 0)}% unter Limit`
                                : `⚠ ${Math.round(currentWeather.humidity || 0) - criteria.maxHumidity}% über Limit`
                              }
                            </div>
                          </div>
                        </div>

                        {/* Temperatur */}
                        <div className="space-y-2">
                          <div className="text-xs  mb-1" style={{color: '#000000'}}>Temperatur</div>
                          
                          {/* Soll-Wert */}
                          <div className="bg-red-50 border border-red-200 rounded px-2 py-1">
                            <div className="text-xs " style={{color: '#000000'}}>Soll-Wert:</div>
                            <div className="" style={{color: '#000000'}}>{criteria.minTemp}°C - {criteria.maxTemp}°C</div>
                          </div>
                          
                          {/* Ist-Wert */}
                          <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1">
                            <div className="text-xs " style={{color: '#000000'}}>Ist-Wert:</div>
                            <div className="" style={{color: '#000000'}}>{Math.round(currentWeather.temperature || 0)}°C</div>
                          </div>
                          
                          {/* Delta */}
                          <div className={`border rounded px-2 py-1 ${
                            (currentWeather.temperature || 0) >= criteria.minTemp && (currentWeather.temperature || 0) <= criteria.maxTemp
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="text-xs " style={{color: '#000000'}}>Delta:</div>
                            <div className="" style={{color: '#000000'}}>
                              {(currentWeather.temperature || 0) >= criteria.minTemp && (currentWeather.temperature || 0) <= criteria.maxTemp
                                ? '✓ Im optimalen Bereich'
                                : (currentWeather.temperature || 0) < criteria.minTemp
                                ? `⚠ ${criteria.minTemp - Math.round(currentWeather.temperature || 0)}°C zu kalt`
                                : `⚠ ${Math.round(currentWeather.temperature || 0) - criteria.maxTemp}°C zu warm`
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Intelligent Harvest Advice */}
                    {(() => {
                      const harvestAdvice = getIntelligentHarvestAdvice(field.cropType, currentWeather, criteria)
                      const bgColor = {
                        'optimal': 'bg-green-50',
                        'acceptable': 'bg-yellow-50', 
                        'temperature': 'bg-orange-50',
                        'humidity': 'bg-blue-50',
                        'critical': 'bg-red-50',
                        'timing': 'bg-purple-50'
                      }[harvestAdvice.type] || 'bg-gray-50'
                      
                      return (
                        <div className={`mb-4 p-3 ${bgColor} rounded-lg border`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{harvestAdvice.icon}</span>
                            <span className="text-sm " style={{color: '#000000'}}>{harvestAdvice.title}</span>
                          </div>
                          <p className="text-sm " style={{color: '#000000'}}>
                            {harvestAdvice.advice}
                          </p>
                        </div>
                      )
                    })()}
                    
                    {/* 7-Day Graph */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">7-Tage Wettertrend</h4>
                        <div className="flex space-x-2 text-xs text-gray-500">
                          <span>Min. {Math.min(...field.dailyRisks.map((d: any) => d.weather.temperature)).toFixed(0)}°C</span>
                          <span>Max. {Math.max(...field.dailyRisks.map((d: any) => d.weather.temperature)).toFixed(0)}°C</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Graph */}
                      <div className="relative bg-gray-50 rounded p-2 border" style={{ height: '150px' }}>
                        <svg className="absolute" style={{ left: '8px', right: '8px', top: '4px', bottom: '4px' }} 
                             width="calc(100% - 16px)" height="calc(100% - 8px)" viewBox="0 0 500 140">
                          
                          {/* Temperature line */}
                          <polyline
                            points={field.dailyRisks.map((day: any, i: number) => 
                              `${(i * 70) + 40},${Math.max(15, Math.min(125, 140 - (day.weather.temperature / 40 * 125)))}`
                            ).join(' ')}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="3"
                          />
                          
                          {/* Humidity line */}
                          <polyline
                            points={field.dailyRisks.map((day: any, i: number) => 
                              `${(i * 70) + 40},${Math.max(15, Math.min(125, 140 - (day.weather.humidity / 100 * 125)))}`
                            ).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                          
                          {/* Temperature points with values */}
                          {field.dailyRisks.map((day: any, i: number) => {
                            const tempY = Math.max(15, Math.min(125, 140 - (day.weather.temperature / 40 * 125)))
                            return (
                              <g key={`temp-${i}`}>
                                <circle
                                  cx={(i * 70) + 40}
                                  cy={tempY}
                                  r="4"
                                  fill="#ef4444"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                                <text
                                  x={(i * 70) + 40}
                                  y={Math.min(135, tempY + 16)}
                                  textAnchor="middle"
                                  className="text-xs font-bold fill-red-600"
                                >
                                  {Math.round(day.weather.temperature)}°
                                </text>
                              </g>
                            )
                          })}
                          
                          {/* Humidity points with values */}
                          {field.dailyRisks.map((day: any, i: number) => {
                            const humidityY = Math.max(15, Math.min(125, 140 - (day.weather.humidity / 100 * 125)))
                            return (
                              <g key={`hum-${i}`}>
                                <circle
                                  cx={(i * 70) + 40}
                                  cy={humidityY}
                                  r="4"
                                  fill="#3b82f6"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                                <text
                                  x={(i * 70) + 40}
                                  y={Math.max(10, humidityY - 10)}
                                  textAnchor="middle"
                                  className="text-xs font-bold fill-blue-600"
                                >
                                  {Math.round(day.weather.humidity)}%
                                </text>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex justify-center space-x-8 mt-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                          <span className="text-xs text-gray-600 font-medium">Temperatur (°C)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm"></div>
                          <span className="text-xs text-gray-600 font-medium">Luftfeuchtigkeit (%)</span>
                        </div>
                      </div>
                      
                      {/* Days labels */}
                      <div className="flex mt-2 px-8 text-sm font-medium text-gray-700">
                        {field.dailyRisks.map((day: any, i: number) => (
                          <div key={i} className="text-center flex-1" style={{ marginLeft: i === 0 ? '24px' : '0', marginRight: i === 6 ? '24px' : '0' }}>
                            <div>{day.dayName}</div>
                            <div className="text-xs text-gray-500">{day.dayNumber}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}