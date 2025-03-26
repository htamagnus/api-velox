import { Injectable } from '@nestjs/common';
import { decode } from '@googlemaps/polyline-codec';

@Injectable()
export default class GoogleMapsClient {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  async getRoute(origin: string, destination: string) {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&mode=bicycling&key=${this.apiKey}`;

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
    apiKey: string,
  ): Promise<number> {
    const path = decode(polyline); // retorna [{ lat, lng }]
    const locations = path
      .slice(0, 512) // limite da API
      .map(([lat, lng]) => `${lat},${lng}`)
      .join('|');

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${locations}&key=${apiKey}`,
    );

    const data = await response.json();
    if (!data.results) throw new Error('Erro ao buscar elevação');

    const elevations = data.results.map((r) => r.elevation);

    let gain = 0;
    for (let i = 1; i < elevations.length; i++) {
      const delta = elevations[i] - elevations[i - 1];
      if (delta > 0) gain += delta;
    }

    return Math.round(gain); // metros
  }
}
