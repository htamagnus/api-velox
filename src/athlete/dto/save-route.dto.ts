import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const saveRouteSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  modality: z.enum(['road', 'mtb', 'general']),
  distanceKm: z.number(),
  estimatedTimeMinutes: z.number(),
  estimatedCalories: z.number(),
  elevationGain: z.number(),
  averageSpeedUsed: z.number(),
  elevationLoss: z.number(),
  polyline: z.string(),
})

export class SaveRouteDto extends createZodDto(saveRouteSchema) {}
