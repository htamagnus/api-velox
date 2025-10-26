import { WeatherCondition } from '@weather/interfaces'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const getWeatherForecastInputDto = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const weatherAlertDto = z.object({
  type: z.enum(['high_rain', 'extreme_temp', 'strong_wind']),
  severity: z.enum(['low', 'medium', 'high']),
  message: z.string().optional(),
  time: z.date().optional(),
})

const routeWeatherDataDto = z.object({
  condition: z.nativeEnum(WeatherCondition),
  temperature: z.number(),
  rainProbability: z.number(),
  windSpeed: z.number(),
  alerts: z.array(weatherAlertDto),
  timestamp: z.date(),
})

const getWeatherForecastOutputDto = z.object({
  weather: routeWeatherDataDto,
})

export class GetWeatherForecastInputDto extends createZodDto(getWeatherForecastInputDto) {}
export class GetWeatherForecastOutputDto extends createZodDto(getWeatherForecastOutputDto) {}
export class RouteWeatherDataDto extends createZodDto(routeWeatherDataDto) {}
export class WeatherAlertDto extends createZodDto(weatherAlertDto) {}
