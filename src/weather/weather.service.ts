import { Injectable } from '@nestjs/common'
import { RouteWeatherData, WeatherCondition, WeatherAlert } from '@weather/interfaces'

import { WeatherClient, WeatherForecast } from '@clients'

@Injectable()
export class WeatherService {
  constructor(private readonly weatherClient: WeatherClient) {}

  async getWeatherForCoordinates(latitude: number, longitude: number): Promise<RouteWeatherData> {
    const weatherData = await this.weatherClient.getWeatherForecast(latitude, longitude)
    const forecast = weatherData.current

    const condition = this.mapWeatherCondition(forecast.description)
    const alerts = this.generateWeatherAlerts(forecast)

    return {
      condition,
      temperature: forecast.temperature,
      rainProbability: forecast.rainProbability,
      windSpeed: forecast.windSpeed,
      alerts,
      timestamp: weatherData.timestamp,
    }
  }

  private mapWeatherCondition(description: string): WeatherCondition {
    const desc = description.toLowerCase()

    if (desc.includes('claro') || desc.includes('ensolarado')) return WeatherCondition.SUNNY
    if (desc.includes('nuvem') || desc.includes('encoberto')) return WeatherCondition.CLOUDY
    if (desc.includes('chuva') || desc.includes('chuvisco')) return WeatherCondition.RAINY
    if (desc.includes('tempestade') || desc.includes('trovejante')) return WeatherCondition.STORMY
    if (desc.includes('neve')) return WeatherCondition.SNOWY

    return WeatherCondition.CLOUDY
  }

  private generateWeatherAlerts(forecast: WeatherForecast): WeatherAlert[] {
    const alerts: WeatherAlert[] = []

    if (forecast.rainProbability > 70) {
      alerts.push({
        type: 'high_rain',
        severity: forecast.rainProbability > 90 ? 'high' : 'medium',
        message: `alta chance de chuva (${forecast.rainProbability}%), considere sair mais cedo`,
      })
    }

    if (forecast.temperature < 10 || forecast.temperature > 30) {
      const severity = forecast.temperature < 5 || forecast.temperature > 35 ? 'high' : 'medium'
      const tempType = forecast.temperature < 10 ? 'frio' : 'calor'
      alerts.push({
        type: 'extreme_temp',
        severity,
        message: `${tempType} extremo previsto (${forecast.temperature}°c)`,
      })
    }

    if (forecast.windSpeed > 25) {
      alerts.push({
        type: 'strong_wind',
        severity: forecast.windSpeed > 40 ? 'high' : 'medium',
        message: `vento forte (${forecast.windSpeed}km/h), cuidado em descidas`,
      })
    }

    return alerts
  }
}
