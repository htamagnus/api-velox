import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const createRouteInputDto = z.object({
  origin: z.string().min(1, 'origem é obrigatória').max(500, 'origem deve ter no máximo 500 caracteres'),
  destination: z.string().min(1, 'destino é obrigatório').max(500, 'destino deve ter no máximo 500 caracteres'),
  modality: z.enum(['road', 'mtb', 'general']),
})

const elevationProfilePointDto = z.object({
  distance: z.number(),
  elevation: z.number(),
})

const alternativeRouteDto = z.object({
  distanceKm: z.number(),
  estimatedTimeMinutes: z.number(),
  estimatedCalories: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number(),
  polyline: z.string(),
  averageSpeedUsed: z.number(),
  elevationProfile: z.array(elevationProfilePointDto).optional(),
  summary: z.string(),
  warnings: z.array(z.string()).optional(),
})

const createRouteResponseDto = z.object({
  distanceKm: z.number(),
  estimatedTimeMinutes: z.number(),
  estimatedCalories: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number(),
  averageSpeedUsed: z.number(),
  modality: z.enum(['road', 'mtb', 'general']),
  polyline: z.string(),
  alternatives: z.array(alternativeRouteDto).optional(),
})

export class GetPlannedRouteInputDto extends createZodDto(createRouteInputDto) {}
export class GetPlannedRouteResponseDto extends createZodDto(createRouteResponseDto) {}
