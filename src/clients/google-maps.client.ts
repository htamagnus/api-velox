import { Injectable } from '@nestjs/common';
import { decode } from '@googlemaps/polyline-codec';
import { ConfigService } from '@nestjs/config';

// ajustar pra pegar as envs com o configService
@Injectable()
export default class GoogleMapsClient {
  constructor(protected readonly configService: ConfigService) {
    this.googleMapsApiKey = this.configService.getOrThrow(
      'GOOGLE_MAPS_API_KEY',
    );
  }

  protected googleMapsApiKey: string;

  async getRoute(origin: string, destination: string) {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&mode=bicycling&key=${this.googleMapsApiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao buscar rota no Google Maps');
    }

    const data = await response.json();

    if (!data.routes || !data.routes.length) {
      throw new Error('Nenhuma rota encontrada');
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    return {
      distanceMeters: leg.distance.value,
      durationSeconds: leg.duration.value,
      polyline: route.overview_polyline.points,
    };
  }

  async getElevationGainFromPolyline(
    polyline: string,
  ): Promise<{ gain: number; loss: number }> {
    const path = decode(polyline); // retorna [{ lat, lng }]
    const locations = path
      .slice(0, 512) // limite da API
      .map(([lat, lng]) => `${lat},${lng}`)
      .join('|');

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${locations}&key=${this.googleMapsApiKey}`,
    );

    const data = await response.json();
    if (!data.results) throw new Error('Erro ao buscar elevação');

    const elevations = data.results.map((r) => r.elevation);

    let gain = 0;
    let loss = 0;

    for (let i = 1; i < elevations.length; i++) {
      const delta = elevations[i] - elevations[i - 1];
      if (delta > 0) gain += delta;
      if (delta < 0) loss += Math.abs(delta);
    }

    return {
      gain: Math.round(gain),
      loss: Math.round(loss),
    };
  }
}
