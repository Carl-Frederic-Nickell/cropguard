import { Request, Response } from 'express';
import { getCurrentWeather, getWeatherForecast, WeatherData, HarvestRecommendation } from '../services/weatherService';

const getHarvestRecommendation = (weather: WeatherData, cropType: string, forecastData?: WeatherData[]): HarvestRecommendation => {
  const { temperature, humidity, precipitationMm, windSpeed } = weather;
  
  // Updated crop criteria based on agricultural specifications
  const cropCriteria: Record<string, any> = {
    weizen: { 
      minTemp: 22, maxTemp: 26, maxHumidity: 60, maxPrecip: 1.5, maxWind: 8,
      harvestDuration: 120, optimalWindow: 14,
      harvestComment: "Unter 18% Kornfeuchte, sonst Gefahr von Lager- und Qualitätsverlusten",
      moistureLimit: 18 // % Kornfeuchte
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
      moistureLimit: 75, // Feldluftfeuchte
      isFieldMoisture: true
    },
    zuckerrueben: {
      minTemp: 8, maxTemp: 15, maxHumidity: 80, maxPrecip: 1.5, maxWind: 12,
      harvestDuration: 180, optimalWindow: 21,
      harvestComment: "Müssen kühl geerntet werden, sonst Lagerverluste", 
      moistureLimit: 80, // Feldluftfeuchte
      isFieldMoisture: true
    },
    sonnenblumen: {
      minTemp: 22, maxTemp: 28, maxHumidity: 15, maxPrecip: 0.5, maxWind: 8,
      harvestDuration: 120, optimalWindow: 14,
      harvestComment: "Ölqualität sinkt bei zu hoher Kornfeuchte",
      moistureLimit: 15 // % Kornfeuchte
    },
    tomaten: { 
      minTemp: 15, maxTemp: 28, maxHumidity: 80, maxPrecip: 1, maxWind: 8,
      harvestDuration: 75, optimalWindow: 14,
      harvestComment: "Empfindlich gegen Nässe und starke Temperaturschwankungen",
      moistureLimit: 80
    }
  };

  const criteria = cropCriteria[cropType.toLowerCase()] || cropCriteria.weizen;
  
  let recommendation: 'good' | 'caution' | 'avoid' = 'good';
  let reasons: string[] = [];
  let riskFactors: Array<{type: 'weather' | 'timing' | 'conditions', severity: 'low' | 'medium' | 'high', description: string}> = [];
  let confidence = 100;

  // Temperature analysis
  if (temperature < criteria.minTemp) {
    const severity = temperature < criteria.minTemp - 5 ? 'high' : 'medium';
    recommendation = severity === 'high' ? 'avoid' : 'caution';
    reasons.push(`Temperatur zu niedrig (${temperature}°C)`);
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Temperatur ${temperature}°C unter Optimal (${criteria.minTemp}-${criteria.maxTemp}°C)`
    });
    confidence -= severity === 'high' ? 30 : 15;
  } else if (temperature > criteria.maxTemp) {
    const severity = temperature > criteria.maxTemp + 5 ? 'high' : 'medium';
    recommendation = severity === 'high' ? 'avoid' : 'caution';
    reasons.push(`Temperatur zu hoch (${temperature}°C)`);
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Temperatur ${temperature}°C über Optimal (${criteria.minTemp}-${criteria.maxTemp}°C)`
    });
    confidence -= severity === 'high' ? 30 : 15;
  }
  
  // Humidity analysis
  if (humidity > criteria.maxHumidity) {
    const severity = humidity > criteria.maxHumidity + 15 ? 'high' : humidity > criteria.maxHumidity + 5 ? 'medium' : 'low';
    if (severity === 'high') recommendation = 'avoid';
    else if (severity === 'medium' && recommendation === 'good') recommendation = 'caution';
    
    reasons.push(`Luftfeuchtigkeit zu hoch (${humidity}%)`);
    riskFactors.push({
      type: 'conditions',
      severity,
      description: `Luftfeuchtigkeit ${humidity}% über Grenzwert (max ${criteria.maxHumidity}%)`
    });
    confidence -= severity === 'high' ? 25 : severity === 'medium' ? 10 : 5;
  }
  
  // Precipitation analysis
  if (precipitationMm > criteria.maxPrecip) {
    const severity = precipitationMm > criteria.maxPrecip * 2 ? 'high' : 'medium';
    recommendation = 'avoid';
    reasons.push(`Zu viel Niederschlag (${precipitationMm.toFixed(1)}mm)`);
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Niederschlag ${precipitationMm.toFixed(1)}mm über Grenzwert (max ${criteria.maxPrecip}mm)`
    });
    confidence -= severity === 'high' ? 40 : 25;
  }
  
  // Wind analysis
  if (windSpeed > criteria.maxWind) {
    const severity = windSpeed > criteria.maxWind + 5 ? 'high' : 'medium';
    if (severity === 'high') recommendation = 'avoid';
    else if (recommendation === 'good') recommendation = 'caution';
    
    reasons.push(`Wind zu stark (${windSpeed.toFixed(1)}m/s)`);
    riskFactors.push({
      type: 'weather',
      severity,
      description: `Windgeschwindigkeit ${windSpeed.toFixed(1)}m/s über Grenzwert (max ${criteria.maxWind}m/s)`
    });
    confidence -= severity === 'high' ? 20 : 10;
  }

  // Calculate next optimal harvest date based on forecast
  let nextOptimalDate: string | undefined;
  if (forecastData && recommendation !== 'good') {
    const optimalForecast = forecastData.find((day, index) => {
      if (index === 0) return false; // Skip today
      const dayRecommendation = getHarvestRecommendation(day, cropType);
      return dayRecommendation.recommendation === 'good';
    });
    
    if (optimalForecast) {
      nextOptimalDate = optimalForecast.date;
    }
  }

  // Ensure confidence doesn't go below 0
  confidence = Math.max(0, Math.min(100, confidence));

  // Add harvest-specific information
  let harvestAdvice = criteria.harvestComment;
  if (recommendation !== 'good') {
    harvestAdvice = `${criteria.harvestComment} - ${reasons.join(', ')}`;
  }

  return {
    cropType,
    recommendation,
    reason: reasons.length > 0 ? reasons.join(', ') : `Optimale Bedingungen für die Ernte. ${criteria.harvestComment}`,
    confidence,
    nextOptimalDate,
    riskFactors,
    harvestAdvice: harvestAdvice,
    moistureLimit: criteria.moistureLimit,
    isFieldMoisture: criteria.isFieldMoisture || false
  };
};

export const getWeatherData = async (req: Request, res: Response) => {
  try {
    const { lat, lon, cropType } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const currentWeather = await getCurrentWeather(Number(lat), Number(lon));
    const forecast = await getWeatherForecast(Number(lat), Number(lon));
    
    let harvestRecommendations: HarvestRecommendation[] = [];
    
    if (cropType) {
      harvestRecommendations = [currentWeather, ...forecast].map((weather, index) => 
        getHarvestRecommendation(weather, String(cropType), index === 0 ? forecast : undefined)
      );
    }

    res.json({
      current: currentWeather,
      forecast,
      harvestRecommendations
    });
  } catch (error) {
    res.status(500).json({ error: 'Weather data fetch failed' });
  }
};
