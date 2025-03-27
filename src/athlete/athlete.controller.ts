import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
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
import { SaveRouteDto } from './dto/save-route.dto';

// TO DO: adicionar swagger
@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post('/register')
  register(@Body(new ZodValidationPipe()) dto: RegisterAthleteDto) {
    return this.athleteService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginAthleteDto) {
    return this.athleteService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  async completeProfile(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() payload: CreateAthleteDto,
  ): Promise<CreateAthleteDto> {
    return this.athleteService.completeProfile(tokenPayload.athleteId, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(
    @Token() tokenPayload: TokenPayloadDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.getProfileById(tokenPayload.athleteId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile/update')
  async updateAthlete(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() body: UpdateAthleteDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.updateAthleteData(tokenPayload.athleteId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile/completeness')
  async getProfileCompleteness(
    @Token() tokenPayload: TokenPayloadDto,
  ): Promise<{ completed: boolean }> {
    return this.athleteService.checkProfileCompleteness(tokenPayload.athleteId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/strava/average-speed')
  async getStravaAverageSpeed(
    @Token() tokenPayload: TokenPayloadDto,
    @Query('code') code: string,
  ): Promise<{ averageSpeedGeneral: number }> {
    return this.athleteService.fetchStravaAverageSpeed(
      tokenPayload.athleteId,
      code,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/routes')
  async planRoute(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() payload: GetPlannedRouteInputDto,
  ): Promise<GetPlannedRouteResponseDto> {
    return this.athleteService.planRouteForAthlete(
      tokenPayload.athleteId,
      payload,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/routes/save')
  @HttpCode(HttpStatus.NO_CONTENT)
  async savePlannedRoute(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() dto: SaveRouteDto,
  ): Promise<void> {
    return this.athleteService.saveRouteForAthlete(tokenPayload.athleteId, dto);
  }
}
