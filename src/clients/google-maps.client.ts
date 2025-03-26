import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { decode } from '@googlemaps/polyline-codec';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import {
  GoogleElevationNotFoundError,
  GoogleRoutesNotFoundError,
} from 'src/errors';

const googleRoutesSchema = z.object({
  distanceMeters: z.number(),
  durationSeconds: z.number(),
  polyline: z.string(),
});

type GoogleRoute = z.infer<typeof googleRoutesSchema>;

@Injectable()
export default class GoogleMapsClient {
  constructor(protected readonly configService: ConfigService) {
    this.googleMapsApiKey = this.configService.getOrThrow(
      'GOOGLE_MAPS_API_KEY',
    );
    this.googleMapsApiUrl = this.configService.getOrThrow(
      'GOOGLE_MAPS_API_URL',
    );
  }

  protected googleMapsApiKey: string;
  protected googleMapsApiUrl: string;

  async getRoute(origin: string, destination: string): Promise<GoogleRoute> {
    try {
      const encodedOrigin = encodeURIComponent(origin);
      const encodedDestination = encodeURIComponent(destination);

      const url = `${this.googleMapsApiUrl}/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&mode=bicycling&key=${this.googleMapsApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || !data.routes.length) {
        throw new GoogleRoutesNotFoundError();
      }

      const route = data.routes[0];
      const leg = route.legs[0];

      return googleRoutesSchema.parse({
        distanceMeters: leg.distance.value,
        durationSeconds: leg.duration.value,
        polyline: route.overview_polyline.points,
      });
    } catch (error) {
      throw new HttpException(
        `Error fetching route: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getElevationFromPolyline(polyline: string): Promise<number[]> {
    try {
      const path = decode(polyline);
      const locations = path
        .slice(0, 512)
        .map(([lat, lng]) => `${lat},${lng}`)
        .join('|');

      const response = await fetch(
        `${this.googleMapsApiUrl}/elevation/json?locations=${locations}&key=${this.googleMapsApiKey}`,
      );

      const data = await response.json();
      if (!data.results) throw new GoogleElevationNotFoundError();

      return data.results.map((r) => r.elevation);
    } catch (error) {
      throw new HttpException(
        `Error fetching elevation: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
