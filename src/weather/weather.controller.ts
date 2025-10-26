import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetWeatherForecastInputDto, GetWeatherForecastOutputDto } from '@weather/dto'
import { WeatherService } from '@weather/weather.service'

import { JwtAuthGuard } from '@auth'

@ApiTags('Weather')
@Controller('athlete/:athleteId/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('/forecast')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get weather forecast for coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: GetWeatherForecastOutputDto,
  })
  async getWeatherForecast(
    @Param('athleteId') athleteId: string,
    @Body() data: GetWeatherForecastInputDto,
  ): Promise<GetWeatherForecastOutputDto> {
    const weather = await this.weatherService.getWeatherForCoordinates(data.latitude, data.longitude)

    return {
      weather,
    }
  }
}
