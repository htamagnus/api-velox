import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const updateAthleteDto = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  averageSpeedRoad: z.number().optional(),
  averageSpeedMtb: z.number().optional(),
  averageSpeedGeneral: z.number().optional(),
})

export class UpdateAthleteDto extends createZodDto(updateAthleteDto) {}
