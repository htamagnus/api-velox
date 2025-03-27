import { Injectable, UnauthorizedException } from '@nestjs/common';
import StravaClient from 'src/clients/strava.client';
import GoogleMapsClient from 'src/clients/google-maps.client';
import { InjectRepository } from '@nestjs/typeorm';
import { AthleteEntity } from './entities/athlete.entity';
import { Repository } from 'typeorm';
import {
  GetPlannedRouteInputDto,
  GetPlannedRouteResponseDto,
} from './dto/create-route.dto';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import {
  AthleteNotFoundError,
  AverageSpeedNotSetError,
  RideActivitiesNotFoundError,
} from 'src/errors';
import { calculateCalories, calculateElevationGainAndLoss } from 'src/utils';
import * as bcrypt from 'bcrypt';
import { RegisterAthleteDto } from './dto/register-athlete.dto';
import { LoginAthleteDto } from './dto/login-athlete.dto';
import { JwtService } from 'src/utils/generate-jwt.utils';
import { EmailAlreadyExistsError } from 'src/errors/email-already-exists.error';
import { SaveRouteDto } from './dto/save-route.dto';
import { SavedRouteEntity } from './entities/saved-routes.entity';
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

  async register(data: RegisterAthleteDto) {
    const existing = await this.athleteRepository.findOne({
      where: { email: data.email },
    });

    if (existing) throw new EmailAlreadyExistsError(); // criar erro

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const athlete = this.athleteRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    await this.athleteRepository.save(athlete);
    return { message: 'Registered successfully' };
  }

  async login(dto: LoginAthleteDto) {
    const athlete = await this.athleteRepository.findOne({
      where: { email: dto.email },
    });
    if (!athlete) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      athlete.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais inválidas'); // criar erro

    const { token, expiresIn } = await this.jwtService.generateAuthToken(
      athlete.id,
    );

    return {
      token,
      expiresIn,
      athleteId: athlete.id,
    };
  }

  private async findAthleteOrThrow(id: string): Promise<AthleteEntity> {
    const athlete = await this.athleteRepository.findOne({ where: { id } });
    if (!athlete) {
      throw new AthleteNotFoundError();
    }
    return athlete;
  }

  async completeProfile(
    athleteId: string,
    data: CreateAthleteDto,
  ): Promise<AthleteEntity> {
    const athlete = await this.findAthleteOrThrow(athleteId);

    athlete.name = data.name;
    athlete.age = data.age;
    athlete.weight = data.weight;
    athlete.height = data.height;
    athlete.averageSpeedRoad = data.averageSpeedRoad;
    athlete.averageSpeedMtb = data.averageSpeedMtb;
    athlete.averageSpeedGeneral = data.averageSpeedGeneral;

    return this.athleteRepository.save(athlete);
  }

  async getProfileById(id: string): Promise<AthleteEntity> {
    const athlete = await this.findAthleteOrThrow(id);
    return athlete;
  }

  async updateAthleteData(
    athleteId: string,
    data: Partial<UpdateAthleteDto>,
  ): Promise<AthleteEntity> {
    await this.athleteRepository.update({ id: athleteId }, data);
    return this.findAthleteOrThrow(athleteId);
  }

  async checkProfileCompleteness(id: string): Promise<{ completed: boolean }> {
    const athlete = await this.findAthleteOrThrow(id);

    const requiredFields = [
      athlete.averageSpeedRoad,
      athlete.averageSpeedMtb,
      athlete.averageSpeedGeneral,
    ];

    const completed = requiredFields.every(
      (field) => field !== null && field !== undefined,
    );

    return { completed };
  }

  async fetchStravaAverageSpeed(
    id: string,
    code: string,
  ): Promise<{ averageSpeedGeneral: number }> {
    const athlete = await this.findAthleteOrThrow(id);

    const tokenResponse = await this.stravaClient.exchangeCodeForToken(code);
    const { access_token, athlete: stravaAthlete } = tokenResponse;

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

    athlete.stravaId = stravaId;
    athlete.averageSpeedGeneral = averageSpeedKmH;
    athlete.averageSpeedGeneralIsFromStrava = true;

    await this.athleteRepository.save(athlete);

    return { averageSpeedGeneral: averageSpeedKmH };
  }

  async planRouteForAthlete(
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

  async saveRouteForAthlete(
    athleteId: string,
    dto: SaveRouteDto,
  ): Promise<void> {
    const savedRoute = this.savedRouteRepository.create({
      ...dto,
      athleteId,
    });

    await this.savedRouteRepository.save(savedRoute);
  }
}
