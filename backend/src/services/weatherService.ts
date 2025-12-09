import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  precipitationMm: number; // Niederschlag in mm/m²
  windSpeed: number;
  condition: string;
  date: string;
}

export interface HarvestRecommendation {
  cropType: string;
  recommendation: 'good' | 'caution' | 'avoid';
  reason: string;
  confidence: number;
  nextOptimalDate?: string;
  riskFactors: Array<{
    type: 'weather' | 'timing' | 'conditions';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  harvestAdvice: string;
  moistureLimit: number;
  isFieldMoisture: boolean;
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
  });

  const data = response.data;
  const precipitationMm = (data.rain?.['1h'] || 0) + (data.snow?.['1h'] || 0);
  
  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    precipitation: data.rain?.['1h'] || 0,
    precipitationMm,
    windSpeed: data.wind.speed,
    condition: data.weather[0].description,
    date: new Date().toISOString()
  };
};

export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherData[]> => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'de'
    }
  });

  return response.data.list.slice(0, 21).map((item: any) => {
    const precipitationMm = (item.rain?.['3h'] || 0) + (item.snow?.['3h'] || 0);
    return {
      temperature: item.main.temp,
      humidity: item.main.humidity,
      precipitation: item.rain?.['3h'] || 0,
      precipitationMm,
      windSpeed: item.wind.speed,
      condition: item.weather[0].description,
      date: item.dt_txt
    };
  });
};
