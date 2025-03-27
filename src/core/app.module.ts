import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AthleteModule } from '../athlete/athlete.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteEntity } from 'src/athlete/entities/athlete.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SavedRouteEntity } from 'src/athlete/entities/saved-routes.entity';

@Module({
  imports: [
    AthleteModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [AthleteEntity, SavedRouteEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
