import { TrafficSeverity } from '@traffic/interfaces'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const getTrafficInputDto = z.object({
  polyline: z.string(),
  origin: z.string(),
  destination: z.string(),
  departureTime: z.string().optional(),
})

const getTrafficOutputDto = z.object({
  traffic: z.object({
    overallSeverity: z.nativeEnum(TrafficSeverity),
    segments: z.array(
      z.object({
        startPoint: z.tuple([z.number(), z.number()]),
        endPoint: z.tuple([z.number(), z.number()]),
        severity: z.nativeEnum(TrafficSeverity),
        speedKmh: z.number(),
        speedLimit: z.number(),
        duration: z.number(),
      }),
    ),
    updatedAt: z.date(),
    delayMinutes: z.number(),
  }),
})

export class GetTrafficInputDto extends createZodDto(getTrafficInputDto) {}
export class GetTrafficOutputDto extends createZodDto(getTrafficOutputDto) {}
