import { AthleteController } from '@athlete/athlete.controller'
import { AthleteService } from '@athlete/athlete.service'
import { AthleteEntity, SavedRouteEntity } from '@commons/entities'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GoogleMapsClient, StravaClient } from '@clients'
import { JwtService } from '@services'

@Module({
  imports: [TypeOrmModule.forFeature([AthleteEntity, SavedRouteEntity])],
  controllers: [AthleteController],
  providers: [AthleteService, StravaClient, GoogleMapsClient, JwtService],
})
export class AthleteModule {}
