import { Injectable } from '@nestjs/common';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import StravaClient from 'src/clients/strava.client';
import { InjectRepository } from '@nestjs/typeorm';
import { AthleteEntity } from './entities/athlete.entity';
import { Repository } from 'typeorm';
import {
  GetPlannedRouteInputDto,
  GetPlannedRouteResponseDto,
} from './dto/create-route.dto';
import GoogleMapsClient from 'src/clients/google-maps.client';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import {
  AthleteNotFoundError,
  AverageSpeedNotSetError,
  RideActivitiesNotFoundError,
} from 'src/errors';
import { calculateCalories, calculateElevationGainAndLoss } from 'src/utils';

@Injectable()
export class AthleteService {
  constructor(
    @InjectRepository(AthleteEntity)
    private readonly athleteRepository: Repository<AthleteEntity>,
    private readonly stravaClient: StravaClient,
    private readonly googleMapsClient: GoogleMapsClient,
  ) {}

  private async findAthleteOrThrow(id: string): Promise<AthleteEntity> {
    const athlete = await this.athleteRepository.findOne({ where: { id } });
    if (!athlete) {
      throw new AthleteNotFoundError();
    }
    return athlete;
  }

  async getAthleteById(id: string): Promise<AthleteEntity> {
    const athlete = await this.findAthleteOrThrow(id);
    return athlete;
  }

  async createAthleteProfile(data: CreateAthleteDto): Promise<AthleteEntity> {
    const athlete = this.athleteRepository.create({
      name: data.name,
      age: data.age,
      weight: data.weight,
      height: data.height,
      averageSpeedRoad: data.averageSpeedRoad,
      averageSpeedMtb: data.averageSpeedMtb,
      isProfileComplete: true,
      stravaId: null,
      accessToken: '',
    });
    return this.athleteRepository.save(athlete);
  }

  async getStravaAverageSpeed(
    id: string,
    code: string,
  ): Promise<{ averageSpeedStrava: number }> {
    const athlete = await this.findAthleteOrThrow(id);

    const tokenResponse = await this.stravaClient.exchangeCodeForToken(code);
    const {
      access_token,
      refresh_token,
      athlete: stravaAthlete,
    } = tokenResponse;

    const stravaId = stravaAthlete.id.toString();

    const activities = await this.stravaClient.getActivities(access_token);
    const rideActivities = activities.filter((a) => a.type === 'Ride');

    if (rideActivities.length === 0) {
      throw new RideActivitiesNotFoundError();
    }

    const totalSpeed = rideActivities.reduce(
      (sum, activity) => sum + activity.average_speed,
      0,
    );
    const averageSpeed = totalSpeed / rideActivities.length;
    const averageSpeedKmH = averageSpeed * 3.6;

    athlete.accessToken = access_token;
    athlete.refreshToken = refresh_token;
    athlete.tokenExpiresAt = tokenResponse.expires_at;
    athlete.stravaId = stravaId;
    athlete.averageSpeedStrava = averageSpeedKmH;

    await this.athleteRepository.save(athlete);

    return { averageSpeedStrava: averageSpeedKmH };
  }

  async getAthleteProfileCompleteness(
    id: string,
  ): Promise<{ completed: boolean }> {
    const athlete = await this.findAthleteOrThrow(id);

    const requiredFields = [
      athlete.averageSpeedRoad,
      athlete.averageSpeedMtb,
      athlete.averageSpeedStrava,
    ];

    const completed = requiredFields.every(
      (field) => field !== null && field !== undefined,
    );

    return { completed };
  }

  async createRoute(
    athleteId: string,
    dto: GetPlannedRouteInputDto,
  ): Promise<GetPlannedRouteResponseDto> {
    const athlete = await this.findAthleteOrThrow(athleteId);

    const { origin, destination, modality } = dto;

    const directions = await this.googleMapsClient.getRoute(
      origin,
      destination,
    );
    const distanceKm = directions.distanceMeters / 1000;
    const polyline = directions.polyline;

    const averageSpeed =
      modality === 'road' ? athlete.averageSpeedRoad : athlete.averageSpeedMtb;

    if (!averageSpeed) throw new AverageSpeedNotSetError(modality);

    const estimatedTimeHours = distanceKm / averageSpeed;
    const estimatedTimeMinutes = estimatedTimeHours * 60;

    const estimatedCalories = calculateCalories({
      weightKg: athlete.weight,
      averageSpeed,
      durationHours: estimatedTimeHours,
    });

    const elevations =
      await this.googleMapsClient.getElevationFromPolyline(polyline);
    const { gain, loss } = calculateElevationGainAndLoss(elevations);

    return {
      distanceKm,
      estimatedTimeMinutes: Math.round(estimatedTimeMinutes),
      estimatedCalories,
      elevationGain: gain,
      elevationLoss: loss,
      polyline,
    };
  }

  async updateAthleteData(
    athleteId: string,
    data: Partial<UpdateAthleteDto>,
  ): Promise<AthleteEntity> {
    await this.athleteRepository.update({ id: athleteId }, data);
    return this.findAthleteOrThrow(athleteId);
  }
}
