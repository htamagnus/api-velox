import { SavedRouteEntity } from '@commons/entities'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GoogleMapsClient } from '@clients'

import { TrafficAlertEntity, TrafficHistoryEntity } from './entities'
import { TrafficController } from './traffic.controller'
import { TrafficService } from './traffic.service'

@Module({
  imports: [TypeOrmModule.forFeature([TrafficHistoryEntity, TrafficAlertEntity, SavedRouteEntity])],
  controllers: [TrafficController],
  providers: [TrafficService, GoogleMapsClient],
  exports: [TrafficService],
})
export class TrafficModule {}
