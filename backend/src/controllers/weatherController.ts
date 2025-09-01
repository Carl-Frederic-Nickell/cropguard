import { Request, Response } from 'express';
import { getCurrentWeather, getWeatherForecast, WeatherData, HarvestRecommendation } from '../services/weatherService';

const getHarvestRecommendation = (weather: WeatherData, cropType: string): HarvestRecommendation => {
  const { temperature, humidity, precipitationMm, windSpeed } = weather;
  
  // Basis-Erntekriterien für verschiedene Pflanzen
  const cropCriteria: Record<string, any> = {
    weizen: { minTemp: 15, maxTemp: 25, maxHumidity: 85, maxPrecip: 2, maxWind: 8 },
    gerste: { minTemp: 12, maxTemp: 22, maxHumidity: 80, maxPrecip: 1.5, maxWind: 10 },
    raps: { minTemp: 10, maxTemp: 20, maxHumidity: 75, maxPrecip: 1, maxWind: 12 },
    mais: { minTemp: 18, maxTemp: 30, maxHumidity: 90, maxPrecip: 3, maxWind: 15 },
    kartoffeln: { minTemp: 8, maxTemp: 25, maxHumidity: 85, maxPrecip: 2, maxWind: 10 },
    tomaten: { minTemp: 15, maxTemp: 28, maxHumidity: 80, maxPrecip: 1, maxWind: 8 }
  };

  const criteria = cropCriteria[cropType.toLowerCase()] || cropCriteria.weizen;
  
  let recommendation: 'good' | 'caution' | 'avoid' = 'good';
  let reasons: string[] = [];

  if (temperature < criteria.minTemp || temperature > criteria.maxTemp) {
    recommendation = temperature < criteria.minTemp - 5 || temperature > criteria.maxTemp + 5 ? 'avoid' : 'caution';
    reasons.push(`Temperatur ungünstig (${temperature}°C)`);
  }
  
  if (humidity > criteria.maxHumidity) {
    recommendation = humidity > criteria.maxHumidity + 10 ? 'avoid' : 'caution';
    reasons.push(`Luftfeuchtigkeit zu hoch (${humidity}%)`);
  }
  
  if (precipitationMm > criteria.maxPrecip) {
    recommendation = 'avoid';
    reasons.push(`Zu viel Niederschlag (${precipitationMm}mm)`);
  }
  
  if (windSpeed > criteria.maxWind) {
    recommendation = windSpeed > criteria.maxWind + 5 ? 'avoid' : 'caution';
    reasons.push(`Wind zu stark (${windSpeed}m/s)`);
  }

  return {
    cropType,
    recommendation,
    reason: reasons.length > 0 ? reasons.join(', ') : 'Optimale Bedingungen'
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
      harvestRecommendations = [currentWeather, ...forecast].map(weather => 
        getHarvestRecommendation(weather, String(cropType))
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
