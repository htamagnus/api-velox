import { Controller, Param, UseGuards, Post, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@auth'

import { GetTrafficOutputDto, GetTrafficForRouteInputDto } from './dto'
import { TrafficService } from './traffic.service'

@ApiTags('Traffic')
@Controller('athlete/:athleteId/traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post('preview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get traffic status for a route during planning' })
  @ApiResponse({
    status: 200,
    description: 'Traffic data retrieved successfully',
    type: GetTrafficOutputDto,
  })
  async getTrafficForPlannedRoute(
    @Param('athleteId') athleteId: string,
    @Body() data: GetTrafficForRouteInputDto,
  ): Promise<GetTrafficOutputDto> {
    return this.trafficService.getTrafficForPlannedRoute(data.polyline, data.origin, data.destination)
  }
}
