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

type GoogleRoute = z.infer<typeof googleRoutesSchema>

@Injectable()
export class GoogleMapsClient {
  constructor(protected readonly configService: ConfigService) {
    this.googleMapsApiKey = this.configService.getOrThrow('GOOGLE_MAPS_API_KEY')
    this.googleMapsApiUrl = this.configService.getOrThrow('GOOGLE_MAPS_API_URL')
  }

  protected googleMapsApiKey: string
  protected googleMapsApiUrl: string

  async getRoute(origin: string, destination: string): Promise<GoogleRoute> {
    try {
      const encodedOrigin = encodeURIComponent(origin)
      const encodedDestination = encodeURIComponent(destination)

      const url = `${this.googleMapsApiUrl}/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&mode=bicycling&key=${this.googleMapsApiKey}`

      const response = await fetch(url)
      const parsedData = googleDirectionsSchema.parse(await response.json())

      if (!parsedData.routes.length || !parsedData.routes[0]?.legs.length) {
        throw new GoogleRoutesNotFoundError()
      }

      const route = parsedData.routes[0]
      const leg = route?.legs[0]

      return googleRoutesSchema.parse({
        distanceMeters: leg?.distance.value,
        durationSeconds: leg?.duration.value,
        polyline: route?.overview_polyline.points,
      })
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
}
