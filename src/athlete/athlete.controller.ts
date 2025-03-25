import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { CreateAthleteFromStravaDto } from './dto/create-athlete-strava.dto';
import { EstimateCaloriesDto } from './dto/estimate-calories.dto';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post('/create')
  async createAthleteProfile(
    @Body() payload: CreateAthleteDto | CreateAthleteFromStravaDto,
    @Param('strategy') strategy: 'strava' | 'manual',
  ): Promise<CreateAthleteDto> {
    return this.athleteService.createAthleteProfile(strategy, payload);
  }

  @Get('/completeness/:id')
  async getAthleteProfileCompleteness(
    @Param('id') id: string,
  ): Promise<{ completed: boolean }> {
    return this.athleteService.getAthleteProfileCompleteness(id);
  }

  @Post('/:id/estimate-calories')
  async estimateCalories(
    @Param('id') id: string,
    @Body() payload: EstimateCaloriesDto,
  ): Promise<{ estimatedCalories: number }> {
    return this.athleteService.estimateCalories(id, payload);
  }
}
