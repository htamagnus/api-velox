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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Athlete')
@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new athlete' })
  @ApiResponse({ status: 201, description: 'Athlete registered successfully' })
  register(@Body(new ZodValidationPipe()) dto: RegisterAthleteDto) {
    return this.athleteService.register(dto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login an athlete' })
  @ApiResponse({
    status: 200,
    description: 'Athlete authenticated successfully',
  })
  login(@Body() dto: LoginAthleteDto) {
    return this.athleteService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete athlete profile' })
  @ApiResponse({ status: 201, description: 'Profile completed successfully' })
  async completeProfile(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() payload: CreateAthleteDto,
  ): Promise<CreateAthleteDto> {
    return this.athleteService.completeProfile(tokenPayload.athleteId, payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get athlete profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the athlete profile',
    type: AthleteEntity,
  })
  @Get('/profile')
  async getProfile(
    @Token() tokenPayload: TokenPayloadDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.getProfileById(tokenPayload.athleteId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update athlete profile data' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: AthleteEntity,
  })
  @Patch('/profile/update')
  async updateAthlete(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() body: UpdateAthleteDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.updateAthleteData(tokenPayload.athleteId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile/completeness')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if profile is complete' })
  @ApiResponse({
    status: 200,
    description: 'Returns profile completeness status',
  })
  async getProfileCompleteness(
    @Token() tokenPayload: TokenPayloadDto,
  ): Promise<{ completed: boolean }> {
    return this.athleteService.checkProfileCompleteness(tokenPayload.athleteId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/strava/average-speed')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get average speed from Strava' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Strava authorization code',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns average speed from Strava',
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Plan a new cycling route' })
  @ApiResponse({
    status: 201,
    description: 'Returns the planned route details',
    type: GetPlannedRouteResponseDto,
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a planned route' })
  @ApiResponse({ status: 204, description: 'Route saved successfully' })
  async savePlannedRoute(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() dto: SaveRouteDto,
  ): Promise<void> {
    return this.athleteService.saveRouteForAthlete(tokenPayload.athleteId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/routes/saved')
  @Get('/routes/saved')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all saved routes' })
  @ApiResponse({
    status: 200,
    description: 'Returns all saved routes for the athlete',
    type: [SaveRouteDto],
  })
  async getSavedRoutes(
    @Token() tokenPayload: TokenPayloadDto,
  ): Promise<SaveRouteDto[]> {
    return this.athleteService.getSavedRoutesForAthlete(tokenPayload.athleteId);
  }
}
