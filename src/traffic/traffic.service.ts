import { SavedRouteEntity } from '@commons/entities'
import { decode } from '@googlemaps/polyline-codec'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GoogleMapsClient } from '@clients'

import { GetTrafficOutputDto } from './dto'
import { TrafficData, TrafficSegment, TrafficSeverity } from './interfaces'

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(SavedRouteEntity)
    private readonly savedRouteRepository: Repository<SavedRouteEntity>,
    private readonly googleMapsClient: GoogleMapsClient,
  ) {}

  async getTrafficUpdateForSavedRoute(athleteId: string, routeId: string): Promise<GetTrafficOutputDto> {
    const savedRoute = await this.savedRouteRepository.findOne({
      where: { athleteId, id: routeId },
    })

    if (!savedRoute) {
      throw new NotFoundException('Route not found')
    }

    const traffic = await this.getTrafficForRoute(
      savedRoute.polyline,
      savedRoute.origin,
      savedRoute.destination,
    )

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

    // decodificar polyline para obter coordenadas
    const coordinates = decode(polyline)
    const segments = this.generateSegments(coordinates, severity)

    return {
      overallSeverity: severity,
      segments,
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

  private generateSegments(
    coordinates: Array<[number, number]>,
    overallSeverity: TrafficSeverity,
  ): TrafficSegment[] {
    const segments: TrafficSegment[] = []

    // dividir a rota em segmentos de aproximadamente 2km
    const segmentCount = Math.max(2, Math.ceil(coordinates.length / 20))
    const coordsPerSegment = Math.ceil(coordinates.length / segmentCount)

    for (let i = 0; i < segmentCount; i++) {
      const startIdx = i * coordsPerSegment
      const endIdx = Math.min((i + 1) * coordsPerSegment, coordinates.length - 1)

      if (startIdx >= coordinates.length - 1) break

      const startPoint = coordinates[startIdx] as [number, number]
      const endPoint = coordinates[endIdx] as [number, number]
      const speed = this.estimateSpeed(overallSeverity)
      const estimatedDuration = this.calculateSegmentDuration(startPoint, endPoint, speed)

      segments.push({
        startPoint,
        endPoint,
        severity: overallSeverity,
        speedKmh: speed,
        speedLimit: 40,
        duration: estimatedDuration,
      })
    }

    return segments
  }

  private calculateSegmentDuration(
    startPoint: [number, number],
    endPoint: [number, number],
    speedKmh: number,
  ): number {
    // aproximar distância entre dois pontos (lat, lon) em km
    const earthRadiusKm = 6371
    const dLat = ((endPoint[0] - startPoint[0]) * Math.PI) / 180
    const dLng = ((endPoint[1] - startPoint[1]) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((startPoint[0] * Math.PI) / 180) *
        Math.cos((endPoint[0] * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceKm = earthRadiusKm * c

    // converter para segundos
    return Math.round((distanceKm / speedKmh) * 3600)
  }

  private estimateSpeed(severity: TrafficSeverity): number {
    const speedMap: Record<TrafficSeverity, number> = {
      [TrafficSeverity.NORMAL]: 25,
      [TrafficSeverity.INTENSE]: 15,
      [TrafficSeverity.CONGESTED]: 5,
    }

    return speedMap[severity]
  }
}
