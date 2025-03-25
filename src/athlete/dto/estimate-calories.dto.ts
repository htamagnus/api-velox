import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const estimateCaloriesDto = z.object({
  distanceKm: z.number(),
  durationMinutes: z.number(),
  type: z.enum(['road', 'mtb']),
});

export class EstimateCaloriesDto extends createZodDto(estimateCaloriesDto) {}
