import { Module } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { AthleteController } from './athlete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteEntity } from './entities/athlete.entity';
import StravaClient from 'src/clients/strava.client';
import GoogleMapsClient from 'src/clients/google-maps.client';
import { JwtService } from 'src/utils/generate-jwt.utils';
import { SavedRouteEntity } from './entities/saved-routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AthleteEntity, SavedRouteEntity])],
  controllers: [AthleteController],
  providers: [AthleteService, StravaClient, GoogleMapsClient, JwtService],
})
export class AthleteModule {}
