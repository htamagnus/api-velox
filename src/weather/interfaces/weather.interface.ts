export enum WeatherCondition {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  STORMY = 'stormy',
  SNOWY = 'snowy',
}

export interface WeatherAlert {
  type: 'high_rain' | 'extreme_temp' | 'strong_wind'
  severity: 'low' | 'medium' | 'high'
  message?: string
  time?: Date
}

export interface RouteWeatherData {
  condition: WeatherCondition
  temperature: number
  rainProbability: number
  windSpeed: number
  alerts: WeatherAlert[]
  timestamp: Date
}
