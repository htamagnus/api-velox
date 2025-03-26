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

  async createAthleteProfile(
    strategy: 'strava' | 'manual',
    data: any,
  ): Promise<AthleteEntity> {
    switch (strategy) {
      case 'strava':
        return this.createAthleteFromStrava(data.code);

      case 'manual':
        return this.createAthleteManually(data);

      default:
        throw new Error('Invalid athlete creation strategy');
    }
  }

  private async createAthleteManually(
    data: CreateAthleteDto,
  ): Promise<AthleteEntity> {
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

  private async createAthleteFromStrava(code: string): Promise<AthleteEntity> {
    // trocar o código pelo token
    const tokenResponse = await this.stravaClient.exchangeCodeForToken(code);
    const { access_token, refresh_token, athlete } = tokenResponse;

    // buscar atividades recentes, melhorar nome da função
    const activities = await this.stravaClient.getActivities(access_token);
    console.log('activities', activities);

    const rideActivities = activities.filter((a) => a.type === 'Ride');
    console.log('rideActivities', rideActivities);

    // calcular a média de velocidade
    const totalSpeed = rideActivities.reduce(
      (sum, activity) => sum + activity.average_speed,
      0,
    );
    console.log('totalSpeed', totalSpeed);

    const averageSpeed = totalSpeed / rideActivities.length; // em m/s

    const averageSpeedKmH = averageSpeed * 3.6; // converter para km/h
    console.log('averageSpeedKmH', averageSpeedKmH);

    // procurar se já existe atleta com o mesmo stravaId
    let athleteEntity = await this.athleteRepository.findOne({
      where: { stravaId: athlete.id.toString() },
    });

    if (athleteEntity) {
      // aualiza o atleta existente
      athleteEntity = this.athleteRepository.merge(athleteEntity, {
        accessToken: access_token,
        refreshToken: refresh_token,
        averageSpeedStrava: averageSpeedKmH,
        tokenExpiresAt: tokenResponse.expires_at,
        isProfileComplete: true,
      });
    } else {
      // cria um novo atleta
      athleteEntity = this.athleteRepository.create({
        name: `${athlete.firstname} ${athlete.lastname}`,
        stravaId: athlete.id.toString(),
        accessToken: access_token,
        refreshToken: refresh_token,
        averageSpeedStrava: averageSpeedKmH,
        tokenExpiresAt: tokenResponse.expires_at,
        isProfileComplete: true,
      });
    }

    return this.athleteRepository.save(athleteEntity);
  }

  async getValidAccessToken(athlete: AthleteEntity): Promise<string> {
    const now = Math.floor(Date.now() / 1000); // tempo atual em segundos

    if (athlete.tokenExpiresAt && now < athlete.tokenExpiresAt) {
      return athlete.accessToken; // token ainda é válido
    }

    // token expirou
    const newToken = await this.stravaClient.refreshAccessToken(
      athlete.refreshToken,
    );

    athlete.accessToken = newToken.access_token;
    athlete.refreshToken = newToken.refresh_token;
    athlete.tokenExpiresAt = newToken.expires_at;

    await this.athleteRepository.save(athlete);

    return newToken.access_token;
  }

  // async updateAverageSpeed(athleteId: string): Promise<AthleteEntity> {
  //   const athlete = await this.athleteRepository.findOneBy({ id: athleteId });

  //   if (!athlete) {
  //     throw new Error('Athlete not found');
  //   }

  //   const accessToken = await this.getValidAccessToken(athlete);
  //   const activities = await this.stravaClient.getActivities(accessToken);
  //   const rideActivities = activities.filter((a) => a.type === 'Ride');

  //   if (!rideActivities.length) {
  //     throw new Error('No ride activities found');
  //   }

  //   const totalSpeed = rideActivities.reduce(
  //     (sum, activity) => sum + activity.average_speed,
  //     0,
  //   );
  //   const averageSpeed = totalSpeed / rideActivities.length;
  //   const averageSpeedKmH = averageSpeed * 3.6;

  //   athlete.averageSpeedRoad = averageSpeedKmH;

  //   return this.athleteRepository.save(athlete);
  // }

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
    data: UpdateAthleteDto,
  ): Promise<AthleteEntity> {
    await this.athleteRepository.update({ id: athleteId }, data);
    return this.athleteRepository.findOneOrFail({ where: { id: athleteId } });
  }
}
