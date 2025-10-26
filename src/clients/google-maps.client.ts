import { decode } from '@googlemaps/polyline-codec'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'

import { GoogleElevationNotFoundError, GoogleRoutesNotFoundError } from '@errors'

const googleRoutesSchema = z.object({
  distanceMeters: z.number(),
  durationSeconds: z.number(),
  polyline: z.string(),
})

const googleDirectionsSchema = z.object({
  routes: z.array(
    z.object({
      legs: z.array(
        z.object({
          distance: z.object({ value: z.number() }),
          duration: z.object({ value: z.number() }),
        }),
      ),
      overview_polyline: z.object({ points: z.string() }),
      warnings: z.array(z.string()).optional(),
    }),
  ),
})

const googleElevationSchema = z.object({
  results: z.array(
    z.object({
      elevation: z.number(),
    }),
  ),
})

const googleDistanceMatrixSchema = z.object({
  rows: z.array(
    z.object({
      elements: z.array(
        z.object({
          status: z.string(),
          duration: z.object({ value: z.number() }).optional(),
          duration_in_traffic: z.object({ value: z.number() }).optional(),
          distance: z.object({ value: z.number() }).optional(),
        }),
      ),
    }),
  ),
})

type GoogleRoute = z.infer<typeof googleRoutesSchema>

export interface GoogleRouteWithAlternatives {
  main: GoogleRoute
  alternatives: GoogleRoute[]
  warnings?: string[][]
}

export interface TrafficStatusResponse {
  durationSeconds: number
  durationInTrafficSeconds: number
  distanceMeters: number
  delaySeconds: number
}

@Injectable()
export class GoogleMapsClient {
  constructor(protected readonly configService: ConfigService) {
    this.googleMapsApiKey = this.configService.getOrThrow('GOOGLE_MAPS_API_KEY')
    this.googleMapsApiUrl = this.configService.getOrThrow('GOOGLE_MAPS_API_URL')
  }

  protected googleMapsApiKey: string
  protected googleMapsApiUrl: string

  async getRoute(origin: string, destination: string): Promise<GoogleRoute> {
    const result = await this.getRouteWithAlternatives(origin, destination)
    return result.main
  }

  async getRouteWithAlternatives(origin: string, destination: string): Promise<GoogleRouteWithAlternatives> {
    try {
      const encodedOrigin = encodeURIComponent(origin)
      const encodedDestination = encodeURIComponent(destination)

      const url = `${this.googleMapsApiUrl}/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&mode=bicycling&alternatives=true&key=${this.googleMapsApiKey}&language=pt-BR`

      const response = await fetch(url)
      const parsedData = googleDirectionsSchema.parse(await response.json())

      if (!parsedData.routes.length || !parsedData.routes[0]?.legs.length) {
        throw new GoogleRoutesNotFoundError()
      }

      const mainRoute = parsedData.routes[0]
      const mainLeg = mainRoute?.legs[0]

      const main = googleRoutesSchema.parse({
        distanceMeters: mainLeg?.distance.value,
        durationSeconds: mainLeg?.duration.value,
        polyline: mainRoute?.overview_polyline.points,
      })

      const alternatives: GoogleRoute[] = []
      const warnings: string[][] = []

      // Process up to 2 alternative routes (routes 1 and 2, since 0 is main)
      for (let i = 1; i < Math.min(parsedData.routes.length, 3); i++) {
        const altRoute = parsedData.routes[i]
        if (!altRoute?.legs.length) continue

        const altLeg = altRoute.legs[0]

        alternatives.push(
          googleRoutesSchema.parse({
            distanceMeters: altLeg?.distance.value,
            durationSeconds: altLeg?.duration.value,
            polyline: altRoute?.overview_polyline.points,
          }),
        )

        if (altRoute.warnings && altRoute.warnings.length > 0) {
          warnings.push(altRoute.warnings)
        } else {
          warnings.push([])
        }
      }

      const result: GoogleRouteWithAlternatives = {
        main,
        alternatives,
      }

      if (warnings.length > 0) {
        result.warnings = warnings
      }

      return result
    } catch (error) {
      throw new HttpException(
        `Error fetching route: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      )
    }
  }

  async getElevationFromPolyline(polyline: string): Promise<number[]> {
    try {
      const path = decode(polyline)
      const locations = path
        .slice(0, 512)
        .map(([lat, lng]) => `${lat},${lng}`)
        .join('|')

      const response = await fetch(
        `${this.googleMapsApiUrl}/elevation/json?locations=${locations}&key=${this.googleMapsApiKey}`,
      )

      const parsedData = googleElevationSchema.parse(await response.json())
      if (!parsedData.results) throw new GoogleElevationNotFoundError()

      return parsedData.results.map(r => r.elevation)
    } catch (error) {
      throw new HttpException(
        `Error fetching elevation: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      )
    }
  }

  async getTrafficStatus(origin: string, destination: string): Promise<TrafficStatusResponse> {
    try {
      const encodedOrigin = encodeURIComponent(origin)
      const encodedDestination = encodeURIComponent(destination)

      const url = `${this.googleMapsApiUrl}/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&mode=bicycling&departure_time=now&key=${this.googleMapsApiKey}`

      const response = await fetch(url)
      const data = await response.json()
      const parsedData = googleDistanceMatrixSchema.parse(data)

      if (!parsedData.rows.length || !parsedData.rows[0]?.elements.length) {
        throw new HttpException('Unable to fetch traffic data', HttpStatus.BAD_GATEWAY)
      }

      const element = parsedData.rows[0]?.elements[0]

      if (!element || element.status !== 'OK') {
        throw new HttpException(`Traffic data unavailable: ${element?.status || 'unknown status'}`, HttpStatus.BAD_GATEWAY)
      }

      if (!element.distance) {
        throw new HttpException('Distance data unavailable', HttpStatus.BAD_GATEWAY)
      }

      // Para bicycling, pode não haver duration_in_traffic. Usar duration como fallback
      const durationSeconds = element.duration?.value ?? 0
      const durationInTrafficSeconds = element.duration_in_traffic?.value ?? element.duration?.value ?? 0
      const distanceMeters = element.distance.value
      const delaySeconds = Math.max(0, durationInTrafficSeconds - durationSeconds)

      return {
        durationSeconds,
        durationInTrafficSeconds,
        distanceMeters,
        delaySeconds,
      }
    } catch (error) {
      throw new HttpException(
        `Error fetching traffic status: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      )
    }
  }
}
