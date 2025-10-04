import { NextRequest, NextResponse } from 'next/server'
import { getCurrentWeather, getWeatherForecast, getHarvestRecommendation } from '@/lib/weather'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const cropType = searchParams.get('cropType')

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const currentWeather = await getCurrentWeather(Number(lat), Number(lon))
    const forecast = await getWeatherForecast(Number(lat), Number(lon))

    let harvestRecommendations: ReturnType<typeof getHarvestRecommendation>[] = []

    if (cropType) {
      harvestRecommendations = [currentWeather, ...forecast].map((weather, index) =>
        getHarvestRecommendation(weather, String(cropType), index === 0 ? forecast : undefined)
      )
    }

    return NextResponse.json({
      current: currentWeather,
      forecast,
      harvestRecommendations
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}