import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createRouteInputDto = z.object({
  origin: z.string(),
  destination: z.string(),
  modality: z.enum(['road', 'mtb']),
});

const createRouteResponseDto = z.object({
  distanceKm: z.number(),
  estimatedTimeMinutes: z.number(),
  estimatedCalories: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number(),
  polyline: z.string(),
});

export class GetPlannedRouteInputDto extends createZodDto(
  createRouteInputDto,
) {}
export class GetPlannedRouteResponseDto extends createZodDto(
  createRouteResponseDto,
) {}
