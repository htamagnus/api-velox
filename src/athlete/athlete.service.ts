import {
  CreateAthleteDto,
  GetPlannedRouteInputDto,
  GetPlannedRouteResponseDto,
  LoginAthleteDto,
  LoginAthleteResponseDto,
  RegisterAthleteDto,
  SaveRouteDto,
  UpdateAthleteDto,
} from '@athlete/dto'
import { AthleteEntity, SavedRouteEntity } from '@athlete/entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { GoogleMapsClient, StravaClient } from '@clients'
import {
  AthleteNotFoundError,
  AverageSpeedNotSetError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  RideActivitiesNotFoundError,
  StravaIdAlreadyExistsError,
} from '@errors'
import { JwtService } from '@services'
import { calculateCalories, calculateElevationGainAndLoss } from '@utils'

@Injectable()
export class AthleteService {
  constructor(
    @InjectRepository(AthleteEntity)
    private readonly athleteRepository: Repository<AthleteEntity>,
    @InjectRepository(SavedRouteEntity)
    private readonly savedRouteRepository: Repository<SavedRouteEntity>,
    private readonly stravaClient: StravaClient,
    private readonly googleMapsClient: GoogleMapsClient,
    private readonly jwtService: JwtService,
  ) {}

  private async create(data: RegisterAthleteDto): Promise<AthleteEntity> {
    const existing = await this.athleteRepository.findOne({
      where: { email: data.email },
    })
    if (existing) throw new EmailAlreadyExistsError()

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const athlete = this.athleteRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    const savedAthlete = await this.athleteRepository.save(athlete)
    return savedAthlete
  }

  async registerAndLogin(dto: RegisterAthleteDto): Promise<LoginAthleteResponseDto> {
    const created = await this.create(dto)
    const { token, expiresIn } = await this.jwtService.generateAuthToken(created.id)

    return {
      token,
      expiresIn,
      athleteId: created.id,
      hasCompletedOnboarding: false,
    }
  }

  async login(dto: LoginAthleteDto): Promise<LoginAthleteResponseDto> {
    const athlete = await this.athleteRepository.findOne({
      where: { email: dto.email },
    })
    if (!athlete) throw new AthleteNotFoundError()

    const isPasswordValid = await bcrypt.compare(dto.password, athlete.password)
    if (!isPasswordValid) throw new InvalidCredentialsError()

    const { token, expiresIn } = await this.jwtService.generateAuthToken(athlete.id)

    return {
      token,
      expiresIn,
      athleteId: athlete.id,
      hasCompletedOnboarding: athlete.hasCompletedOnboarding,
    }
  }

  private async findAthleteOrThrow(id: string): Promise<AthleteEntity> {
    const athlete = await this.athleteRepository.findOne({ where: { id } })

    if (!athlete) {
      throw new AthleteNotFoundError()
    }

    return athlete
  }

  async completeProfile(athleteId: string, data: CreateAthleteDto): Promise<AthleteEntity> {
    const athlete = await this.findAthleteOrThrow(athleteId)

    athlete.name = data.name
    athlete.age = data.age
    athlete.weight = data.weight
    athlete.height = data.height
    athlete.averageSpeedRoad = data.averageSpeedRoad
    athlete.averageSpeedMtb = data.averageSpeedMtb
    athlete.averageSpeedGeneral = data.averageSpeedGeneral

    athlete.hasCompletedOnboarding = true

    return this.athleteRepository.save(athlete)
  }

  async getProfileById(id: string): Promise<AthleteEntity> {
    const athlete = await this.findAthleteOrThrow(id)

    return athlete
  }

  async updateAthleteData(athleteId: string, data: Partial<UpdateAthleteDto>): Promise<AthleteEntity> {
    const updateData = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.age !== undefined && { age: data.age }),
      ...(data.weight !== undefined && { weight: data.weight }),
      ...(data.height !== undefined && { height: data.height }),
      ...(data.averageSpeedRoad !== undefined && { averageSpeedRoad: data.averageSpeedRoad }),
      ...(data.averageSpeedMtb !== undefined && { averageSpeedMtb: data.averageSpeedMtb }),
      ...(data.averageSpeedGeneral !== undefined && { averageSpeedGeneral: data.averageSpeedGeneral }),
    }

    await this.athleteRepository.update({ id: athleteId }, updateData)

    return this.findAthleteOrThrow(athleteId)
  }

  async checkProfileCompleteness(id: string): Promise<{ completed: boolean }> {
    const athlete = await this.findAthleteOrThrow(id)

    const requiredFields = [athlete.averageSpeedRoad, athlete.averageSpeedMtb, athlete.averageSpeedGeneral]

    const completed = requiredFields.every(field => field !== null && field !== undefined)

    return { completed }
  }

  async fetchStravaAverageSpeed(id: string, code: string): Promise<{ averageSpeedGeneral: number }> {
    const athlete = await this.findAthleteOrThrow(id)

    const tokenResponse = await this.stravaClient.exchangeCodeForToken(code)

    const { access_token, athlete: stravaAthlete } = tokenResponse

    const stravaId = stravaAthlete.id.toString()

    const existing = await this.athleteRepository.findOneBy({ stravaId })

    if (existing && existing.id !== id) {
      throw new StravaIdAlreadyExistsError()
    }

    const activities = await this.stravaClient.getActivities(access_token)

    const rideActivities = activities.filter(a => a.type === 'Ride')

    if (rideActivities.length === 0) {
      throw new RideActivitiesNotFoundError()
    }

    const totalSpeed = rideActivities.reduce((sum, activity) => sum + activity.average_speed, 0)

    const averageSpeed = totalSpeed / rideActivities.length

    const averageSpeedKmH = averageSpeed * 3.6

    athlete.stravaId = stravaId
    athlete.averageSpeedGeneral = averageSpeedKmH
    athlete.averageSpeedGeneralIsFromStrava = true

    await this.athleteRepository.save(athlete)

    return { averageSpeedGeneral: averageSpeedKmH }
  }

  private async processRoute(
    polyline: string,
    distanceMeters: number,
    averageSpeed: number,
    athleteWeight: number,
  ): Promise<{
    distanceKm: number
    estimatedTimeMinutes: number
    estimatedCalories: number
    elevationGain: number
    elevationLoss: number
    elevations: number[]
  }> {
    const distanceKm = distanceMeters / 1000
    const estimatedTimeHours = distanceKm / averageSpeed
    const estimatedTimeMinutes = estimatedTimeHours * 60

    const estimatedCalories = calculateCalories({
      weightKg: athleteWeight,
      averageSpeed,
      durationHours: estimatedTimeHours,
    })

    const elevations = await this.googleMapsClient.getElevationFromPolyline(polyline)
    const { gain, loss } = calculateElevationGainAndLoss(elevations)

    return {
      distanceKm,
      estimatedTimeMinutes: Math.round(estimatedTimeMinutes),
      estimatedCalories,
      elevationGain: gain,
      elevationLoss: loss,
      elevations,
    }
  }

  private generateRouteSummary(
    altRoute: { distanceKm: number; elevationGain: number },
    mainRoute: { distanceKm: number; elevationGain: number },
  ): string {
    const distanceDiffPercent = ((altRoute.distanceKm - mainRoute.distanceKm) / mainRoute.distanceKm) * 100
    const elevationDiffPercent =
      mainRoute.elevationGain > 0
        ? ((altRoute.elevationGain - mainRoute.elevationGain) / mainRoute.elevationGain) * 100
        : 0

    if (distanceDiffPercent < -5) {
      return 'Rota mais curta'
    }
    if (elevationDiffPercent < -15) {
      return 'Rota com menos subidas'
    }
    if (elevationDiffPercent > 20) {
      return 'Rota com mais subidas'
    }
    if (distanceDiffPercent > 10) {
      return 'Rota mais longa'
    }
    return 'Rota alternativa'
  }

  private createElevationProfile(
    elevations: number[],
    distanceKm: number,
  ): Array<{ distance: number; elevation: number }> {
    const totalDistanceMeters = distanceKm * 1000
    return elevations.map((elevation, index) => ({
      distance: Math.round((totalDistanceMeters * index) / (elevations.length - 1 || 1)),
      elevation: Math.round(elevation),
    }))
  }

  async planRouteForAthlete(
    athleteId: string,
    dto: GetPlannedRouteInputDto,
  ): Promise<GetPlannedRouteResponseDto> {
    const athlete = await this.findAthleteOrThrow(athleteId)

    const { origin, destination, modality } = dto

    const directionsResult = await this.googleMapsClient.getRouteWithAlternatives(origin, destination)

    let averageSpeed: number | null = null

    switch (modality) {
      case 'road':
        averageSpeed = athlete.averageSpeedRoad ?? null
        break
      case 'mtb':
        averageSpeed = athlete.averageSpeedMtb ?? null
        break
      case 'general':
        averageSpeed = athlete.averageSpeedGeneral ?? null
        break
      default:
        throw new Error(`Modality not supported: ${modality}`)
    }

    if (averageSpeed == null || averageSpeed <= 0) {
      throw new AverageSpeedNotSetError(modality)
    }

    // Process main route
    const mainRouteData = await this.processRoute(
      directionsResult.main.polyline,
      directionsResult.main.distanceMeters,
      averageSpeed,
      athlete.weight,
    )

    // Process alternative routes
    const alternatives = []
    for (let i = 0; i < directionsResult.alternatives.length; i++) {
      const altRoute = directionsResult.alternatives[i]
      if (!altRoute) continue

      const altRouteData = await this.processRoute(
        altRoute.polyline,
        altRoute.distanceMeters,
        averageSpeed,
        athlete.weight,
      )

      const summary = this.generateRouteSummary(
        { distanceKm: altRouteData.distanceKm, elevationGain: altRouteData.elevationGain },
        { distanceKm: mainRouteData.distanceKm, elevationGain: mainRouteData.elevationGain },
      )

      const warnings: string[] = []
      const routeWarnings = directionsResult.warnings?.[i]
      if (routeWarnings && routeWarnings.length > 0) {
        warnings.push(...routeWarnings)
      }

      if (altRouteData.elevationGain > mainRouteData.elevationGain * 1.2) {
        warnings.push('Subidas mais acentuadas')
      }

      const elevationProfile = this.createElevationProfile(altRouteData.elevations, altRouteData.distanceKm)

      alternatives.push({
        distanceKm: altRouteData.distanceKm,
        estimatedTimeMinutes: altRouteData.estimatedTimeMinutes,
        estimatedCalories: altRouteData.estimatedCalories,
        elevationGain: altRouteData.elevationGain,
        elevationLoss: altRouteData.elevationLoss,
        polyline: altRoute.polyline,
        averageSpeedUsed: averageSpeed,
        elevationProfile,
        summary,
        warnings: warnings.length > 0 ? warnings : undefined,
      })
    }

    return {
      distanceKm: mainRouteData.distanceKm,
      estimatedTimeMinutes: mainRouteData.estimatedTimeMinutes,
      estimatedCalories: mainRouteData.estimatedCalories,
      elevationGain: mainRouteData.elevationGain,
      elevationLoss: mainRouteData.elevationLoss,
      modality,
      averageSpeedUsed: averageSpeed,
      polyline: directionsResult.main.polyline,
      alternatives: alternatives.length > 0 ? alternatives : undefined,
    }
  }

  async saveRouteForAthlete(athleteId: string, dto: SaveRouteDto): Promise<void> {
    const savedRoute = this.savedRouteRepository.create({
      ...dto,
      athleteId,
    })

    await this.savedRouteRepository.save(savedRoute)
  }

  async getSavedRoutesForAthlete(athleteId: string): Promise<SaveRouteDto[]> {
    const savedRoutes = await this.savedRouteRepository.find({
      where: { athleteId },
      order: { createdAt: 'DESC' },
    })

    return savedRoutes.map(route => ({
      origin: route.origin,
      destination: route.destination,
      modality: route.modality,
      distanceKm: route.distanceKm,
      estimatedTimeMinutes: route.estimatedTimeMinutes,
      estimatedCalories: route.estimatedCalories,
      elevationGain: route.elevationGain ?? 0,
      elevationLoss: route.elevationLoss ?? 0,
      averageSpeedUsed: route.averageSpeedUsed,
      polyline: route.polyline,
    }))
  }
}
