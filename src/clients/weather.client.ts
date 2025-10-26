import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'

const weatherApiResponseSchema = z.object({
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        temp: z.number(),
        feels_like: z.number(),
        humidity: z.number(),
        pressure: z.number(),
      }),
      weather: z.array(
        z.object({
          id: z.number(),
          main: z.string(),
          description: z.string(),
        }),
      ),
      clouds: z.object({
        all: z.number(),
      }),
      wind: z.object({
        speed: z.number(),
        deg: z.number().optional(),
      }),
      pop: z.number().optional(),
      visibility: z.number().optional(),
    }),
  ),
  city: z.object({
    name: z.string(),
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
  }),
})

export interface WeatherForecast {
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  rainProbability: number
  windSpeed: number
  windDirection: number | undefined
  cityName: string
}

export interface WeatherData {
  current: WeatherForecast
  forecasts: WeatherForecast[]
  timestamp: Date
}

@Injectable()
export class WeatherClient {
  constructor(protected readonly configService: ConfigService) {
    this.openWeatherApiKey = this.configService.getOrThrow('OPENWEATHER_API_KEY')
    this.openWeatherApiUrl = this.configService.getOrThrow('OPENWEATHER_API_URL')
  }

  protected openWeatherApiKey: string
  protected openWeatherApiUrl: string

  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const url = `${this.openWeatherApiUrl}/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${this.openWeatherApiKey}`

      const response = await fetch(url)
      const data = await response.json()
      const parsedData = weatherApiResponseSchema.parse(data)

      if (!parsedData.list.length) {
        throw new HttpException('Weather data unavailable', HttpStatus.BAD_GATEWAY)
      }

      const firstItem = parsedData.list[0]
      if (!firstItem) {
        throw new HttpException('Weather data unavailable', HttpStatus.BAD_GATEWAY)
      }

      const current = this.mapWeatherData(firstItem, parsedData.city.name)
      const forecasts = parsedData.list
        .slice(1, 5)
        .map(item => this.mapWeatherData(item, parsedData.city.name))

      return {
        current,
        forecasts,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new HttpException(
        `Error fetching weather data: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      )
    }
  }

  private mapWeatherData(
    item: z.infer<typeof weatherApiResponseSchema>['list'][0],
    cityName: string,
  ): WeatherForecast {
    const weather = item.weather[0]

    if (!weather) {
      return {
        temperature: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        description: 'indefinido',
        rainProbability: Math.round((item.pop ?? 0) * 100),
        windSpeed: Math.round(item.wind.speed * 3.6),
        windDirection: item.wind.deg,
        cityName,
      }
    }

    return {
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      description: weather.description,
      rainProbability: Math.round((item.pop ?? 0) * 100),
      windSpeed: Math.round(item.wind.speed * 3.6),
      windDirection: item.wind.deg,
      cityName,
    }
  }
}
