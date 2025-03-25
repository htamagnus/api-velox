import { Module } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { AthleteController } from './athlete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteEntity } from './entities/athlete.entity';
import StravaClient from 'src/clients/strava.client';

@Module({
  imports: [TypeOrmModule.forFeature([AthleteEntity])],
  controllers: [AthleteController],
  providers: [AthleteService, StravaClient],
})
export class AthleteModule {}
