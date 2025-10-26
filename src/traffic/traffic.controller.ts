import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@auth'

import { GetTrafficOutputDto } from './dto'
import { TrafficService } from './traffic.service'

@ApiTags('Traffic')
@Controller('athlete/:athleteId/traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get(':routeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get traffic status for a route' })
  @ApiResponse({
    status: 200,
    description: 'Traffic data retrieved successfully',
    type: GetTrafficOutputDto,
  })
  async getTrafficUpdate(
    @Param('athleteId') athleteId: string,
    @Param('routeId') routeId: string,
  ): Promise<GetTrafficOutputDto> {
    return this.trafficService.getTrafficUpdateForSavedRoute(athleteId, routeId)
  }
}
