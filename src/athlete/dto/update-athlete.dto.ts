import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateAthleteDto = z.object({
  name: z.string(),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  averageSpeedRoad: z.number(),
  averageSpeedMtb: z.number(),
  averageSpeedStrava: z.number(),
});

export class UpdateAthleteDto extends createZodDto(updateAthleteDto) {}
