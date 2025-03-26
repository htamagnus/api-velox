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
import { calculateCalories } from 'src/utils/calculate-calories.utils';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Injectable()
export class AthleteService {
  constructor(
    @InjectRepository(AthleteEntity)
    private readonly athleteRepository: Repository<AthleteEntity>,
    private readonly stravaClient: StravaClient,
    private readonly googleMapsClient: GoogleMapsClient,
  ) {}

  async getAthleteById(id: string): Promise<AthleteEntity> {
    const athlete = await this.athleteRepository.findOne({
      where: { id },
    });

    if (!athlete) {
      throw new Error('Athlete not found');
    }

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
    const athlete = await this.athleteRepository.findOneOrFail({
      where: { id },
    });

    const tokenResponse = await this.stravaClient.exchangeCodeForToken(code);
    const {
      access_token,
      refresh_token,
      athlete: stravaAthlete,
    } = tokenResponse;

    const stravaId = stravaAthlete.id.toString();

    const activities = await this.stravaClient.getActivities(access_token);
    const rideActivities = activities.filter((a) => a.type === 'Ride');

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
    const athlete = await this.athleteRepository.findOne({ where: { id } });

    if (!athlete) {
      throw new Error('Athlete not found');
    }

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
    const athlete = await this.athleteRepository.findOne({
      where: { id: athleteId },
    });
    if (!athlete) throw new Error('Athlete not found');

    const { origin, destination, modality } = dto;

    const directions = await this.googleMapsClient.getRoute(
      origin,
      destination,
    );
    const distanceKm = directions.distanceMeters / 1000;
    const polyline = directions.polyline;

    const averageSpeed =
      modality === 'road' ? athlete.averageSpeedRoad : athlete.averageSpeedMtb;

    if (!averageSpeed)
      throw new Error('Average speed not set for this modality');

    const estimatedTimeHours = distanceKm / averageSpeed;
    const estimatedTimeMinutes = estimatedTimeHours * 60;

    const estimatedCalories = calculateCalories({
      weightKg: athlete.weight,
      averageSpeed,
      durationHours: estimatedTimeHours,
    });

    const elevation =
      await this.googleMapsClient.getElevationGainFromPolyline(polyline);

    return {
      distanceKm,
      estimatedTimeMinutes: Math.round(estimatedTimeMinutes),
      estimatedCalories,
      elevationGain: elevation.gain,
      elevationLoss: elevation.loss,
      polyline,
    };
  }

  async updateAthleteData(
    athleteId: string,
    data: Partial<UpdateAthleteDto>,
  ): Promise<AthleteEntity> {
    await this.athleteRepository.update({ id: athleteId }, data);
    return this.athleteRepository.findOneOrFail({ where: { id: athleteId } });
  }
}
