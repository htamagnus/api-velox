import { Injectable } from '@nestjs/common'

import { GoogleMapsClient } from '@clients'

import { GetTrafficOutputDto } from './dto'
import { TrafficData, TrafficSeverity } from './interfaces'

@Injectable()
export class TrafficService {
  constructor(private readonly googleMapsClient: GoogleMapsClient) {}

  async getTrafficForPlannedRoute(
    polyline: string,
    origin: string,
    destination: string,
  ): Promise<GetTrafficOutputDto> {
    const traffic = await this.getTrafficForRoute(polyline, origin, destination)

    return {
      traffic,
    }
  }

  private async getTrafficForRoute(
    polyline: string,
    origin: string,
    destination: string,
  ): Promise<TrafficData> {
    const trafficStatus = await this.googleMapsClient.getTrafficStatus(origin, destination)

    const severity = this.calculateSeverity(trafficStatus.delaySeconds)
    const delayMinutes = Math.round(trafficStatus.delaySeconds / 60)

    return {
      overallSeverity: severity,
      segments: [],
      updatedAt: new Date(),
      delayMinutes,
    }
  }

  private calculateSeverity(delaySeconds: number): TrafficSeverity {
    const delayMinutes = delaySeconds / 60

    if (delayMinutes < 5) return TrafficSeverity.NORMAL
    if (delayMinutes < 15) return TrafficSeverity.INTENSE
    return TrafficSeverity.CONGESTED
  }
}
