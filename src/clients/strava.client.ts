import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'

const stravaActivitySchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    average_speed: z.number(),
    distance: z.number(),
    moving_time: z.number(),
  }),
)

const stravaTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  athlete: z.object({
    id: z.number(),
    username: z.string().nullable(),
    firstname: z.string(),
    lastname: z.string(),
  }),
})

export type StravaActivity = z.infer<typeof stravaActivitySchema>[0]
export type StravaToken = z.infer<typeof stravaTokenSchema>
@Injectable()
export class StravaClient {
  constructor(protected readonly configService: ConfigService) {
    this.stravaClientId = this.configService.getOrThrow('STRAVA_CLIENT_ID')
    this.stravaClientSecret = this.configService.getOrThrow('STRAVA_CLIENT_SECRET')
    this.stravaBaseUrl = this.configService.getOrThrow('STRAVA_API_URL')
  }

  protected stravaClientId: string
  protected stravaClientSecret: string
  protected stravaBaseUrl: string

  async exchangeCodeForToken(code: string) {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.stravaClientId,
          client_secret: this.stravaClientSecret,
          code,
          grant_type: 'authorization_code',
        }),
      })

      const data = await response.json()
      return stravaTokenSchema.parse(data)
    } catch (error) {
      throw new HttpException(
        `Error fetching: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      )
    }
  }

  async getActivities(accessToken: string, page = 1, perPage = 30): Promise<StravaActivity[]> {
    try {
      const response = await fetch(
        `${this.stravaBaseUrl}/athlete/activities?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      const data = await response.json()
      return stravaActivitySchema.parse(data)
    } catch (error) {
      throw new HttpException(
        `Error fetching activities: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.BAD_GATEWAY,
      )
    }
  }
}
