import { TrafficSeverity } from '@traffic/interfaces'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const trafficAlertDto = z.object({
  id: z.string().uuid(),
  athleteId: z.string().uuid(),
  routeId: z.string().uuid(),
  severity: z.nativeEnum(TrafficSeverity),
  message: z.string(),
  createdAt: z.date(),
  isResolved: z.boolean(),
})

export class TrafficAlert extends createZodDto(trafficAlertDto) {}
