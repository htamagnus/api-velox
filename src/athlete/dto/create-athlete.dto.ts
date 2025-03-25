import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAthleteDto = z.object({
  name: z.string(),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  averageSpeedRoad: z.number(),
  averageSpeedMtb: z.number(),
  averageSpeedStrava: z.number(),
});

export class CreateAthleteDto extends createZodDto(createAthleteDto) {}
