import { Module } from '@nestjs/common'
import { WeatherController } from '@weather/weather.controller'
import { WeatherService } from '@weather/weather.service'

import { WeatherClient } from '@clients'

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, WeatherClient],
  exports: [WeatherService],
})
export class WeatherModule {}
