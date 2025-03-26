import { Module } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { AthleteController } from './athlete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteEntity } from './entities/athlete.entity';
import StravaClient from 'src/clients/strava.client';
import GoogleMapsClient from 'src/clients/google-maps.client';

@Module({
  imports: [TypeOrmModule.forFeature([AthleteEntity])],
  controllers: [AthleteController],
  providers: [AthleteService, StravaClient, GoogleMapsClient],
})
export class AthleteModule {}
