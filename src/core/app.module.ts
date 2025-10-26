import { AthleteModule } from '@athlete/athlete.module'
import { AthleteEntity, SavedRouteEntity } from '@commons/entities'
import { AppController } from '@core/app.controller'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrafficAlertEntity, TrafficHistoryEntity } from '@traffic/entities'
import { TrafficModule } from '@traffic/traffic.module'
@Module({
  imports: [
    AthleteModule,
    TrafficModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [AthleteEntity, SavedRouteEntity, TrafficHistoryEntity, TrafficAlertEntity],
        synchronize: true,
        ssl: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
