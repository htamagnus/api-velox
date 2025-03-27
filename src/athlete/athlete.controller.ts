import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Patch,
  UseGuards,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Token, TokenPayloadDto } from 'src/decorators/token-payload.decorator';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getAthlete(
    @Token() tokenPayload: TokenPayloadDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.getAthleteById(tokenPayload.athleteId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/complete-profile')
  async completeProfile(
    @Body() payload: CreateAthleteDto,
  ): Promise<CreateAthleteDto> {
    return this.athleteService.createAthleteProfile(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/discover-strava-average')
  async discoverAverageSpeedFromStrava(
    @Token() tokenPayload: TokenPayloadDto,
    @Query('code') code: string,
  ): Promise<{ averageSpeedGeneral: number }> {
    return this.athleteService.getStravaAverageSpeed(
      tokenPayload.athleteId,
      code,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/completeness/:id')
  async getAthleteProfileCompleteness(
    @Param('id') id: string,
  ): Promise<{ completed: boolean }> {
    return this.athleteService.getAthleteProfileCompleteness(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/plan-route')
  async createRoute(
    @Param('id') id: string,
    @Body() payload: GetPlannedRouteInputDto,
  ): Promise<GetPlannedRouteResponseDto> {
    return this.athleteService.createRoute(id, payload);
  }

  @UseGuards(JwtAuthGuard)
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
