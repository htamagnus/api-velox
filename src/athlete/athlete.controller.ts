import { AthleteService } from '@athlete/athlete.service'
import {
    CreateAthleteDto,
    GetPlannedRouteInputDto,
    GetPlannedRouteResponseDto,
    LoginAthleteDto,
    LoginAthleteResponseDto,
    RegisterAndLoginAthleteDto,
    RegisterAthleteDto,
    SaveRouteDto,
    UpdateAthleteDto,
} from '@athlete/dto'
import { AthleteEntity } from '@athlete/entities'
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { ZodValidationPipe } from 'nestjs-zod'

import { JwtAuthGuard } from '@auth'
import { Token, TokenPayloadDto } from '@decorators'

@ApiTags('Athlete')
@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @Post('/register')
  @ApiOperation({ summary: 'Register a new athlete' })
  @ApiResponse({ status: 201, description: 'Athlete registered and logged in successfully' })
  register(@Body(new ZodValidationPipe()) dto: RegisterAthleteDto): Promise<RegisterAndLoginAthleteDto> {
    return this.athleteService.registerAndLogin(dto)
  }

  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @Post('/login')
  @ApiOperation({ summary: 'Login an athlete' })
  @ApiResponse({
    status: 200,
    description: 'Athlete authenticated successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginAthleteDto): Promise<LoginAthleteResponseDto> {
    return this.athleteService.login(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete athlete profile' })
  @ApiResponse({ status: 201, description: 'Profile completed successfully' })
  async completeProfile(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() payload: CreateAthleteDto,
  ): Promise<AthleteEntity> {
    return this.athleteService.completeProfile(tokenPayload.athleteId, payload)
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
  async getProfile(@Token() tokenPayload: TokenPayloadDto): Promise<AthleteEntity> {
    return this.athleteService.getProfileById(tokenPayload.athleteId)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update athlete profile data' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UpdateAthleteDto,
  })
  @Patch('/profile/update')
  async updateAthlete(
    @Token() tokenPayload: TokenPayloadDto,
    @Body() body: UpdateAthleteDto,
  ): Promise<UpdateAthleteDto> {
    return this.athleteService.updateAthleteData(tokenPayload.athleteId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile/completeness')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if profile is complete' })
  @ApiResponse({
    status: 200,
    description: 'Returns profile completeness status',
  })
  async getProfileCompleteness(@Token() tokenPayload: TokenPayloadDto): Promise<{ completed: boolean }> {
    return this.athleteService.checkProfileCompleteness(tokenPayload.athleteId)
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
    return this.athleteService.fetchStravaAverageSpeed(tokenPayload.athleteId, code)
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
    return this.athleteService.planRouteForAthlete(tokenPayload.athleteId, payload)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/routes/save')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a planned route' })
  @ApiResponse({ status: 204, description: 'Route saved successfully' })
  async savePlannedRoute(@Token() tokenPayload: TokenPayloadDto, @Body() dto: SaveRouteDto): Promise<void> {
    return this.athleteService.saveRouteForAthlete(tokenPayload.athleteId, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/routes/saved')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all saved routes' })
  @ApiResponse({
    status: 200,
    description: 'Returns all saved routes for the athlete',
    type: [SaveRouteDto],
  })
  async getSavedRoutes(@Token() tokenPayload: TokenPayloadDto): Promise<SaveRouteDto[]> {
    return this.athleteService.getSavedRoutesForAthlete(tokenPayload.athleteId)
  }
}
