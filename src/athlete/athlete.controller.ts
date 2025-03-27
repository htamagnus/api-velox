import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import {
  GetPlannedRouteInputDto,
  GetPlannedRouteResponseDto,
} from './dto/create-route.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { AthleteEntity } from './entities/athlete.entity';
import { RegisterAthleteDto } from './dto/register-athlete.dto';
import { LoginAthleteDto } from './dto/login-athlete.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Get('/:id')
  async getAthlete(@Param('id') id: string): Promise<AthleteEntity> {
    return this.athleteService.getAthleteById(id);
  }

  @Post('/create')
  async createAthleteProfile(
    @Body() payload: CreateAthleteDto,
  ): Promise<CreateAthleteDto> {
    return this.athleteService.createAthleteProfile(payload);
  }

  @Get('/:id/discover-strava-average')
  async discoverAverageSpeedFromStrava(
    @Param('id') id: string,
    @Query('code') code: string,
  ): Promise<{ averageSpeedGeneral: number }> {
    return this.athleteService.getStravaAverageSpeed(id, code);
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

  @Patch('/:id/update')
  async updateAthlete(
    @Param('id') id: string,
    @Body() body: UpdateAthleteDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.updateAthleteData(id, body);
  }

  @Post('/register')
  register(@Body(new ZodValidationPipe()) dto: RegisterAthleteDto) {
    return this.athleteService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginAthleteDto) {
    return this.athleteService.login(dto);
  }
}
