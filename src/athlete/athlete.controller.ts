import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { CreateAthleteFromStravaDto } from './dto/create-athlete-strava.dto';
import {
  GetPlannedRouteInputDto,
  GetPlannedRouteResponseDto,
} from './dto/create-route.dto';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post('/create')
  async createAthleteProfile(
    @Body() payload: CreateAthleteDto | CreateAthleteFromStravaDto,
    @Query('strategy') strategy: 'strava' | 'manual',
  ): Promise<CreateAthleteDto> {
    return this.athleteService.createAthleteProfile(strategy, payload);
  }

  @Get('/completeness/:id')
  async getAthleteProfileCompleteness(
    @Param('id') id: string,
  ): Promise<{ completed: boolean }> {
    return this.athleteService.getAthleteProfileCompleteness(id);
  }

  @Post('/:id/plan-route')
  async createRoute(
    @Param('id') id: string,
    @Body() payload: GetPlannedRouteInputDto,
  ): Promise<GetPlannedRouteResponseDto> {
    return this.athleteService.createRoute(id, payload);
  }
}
