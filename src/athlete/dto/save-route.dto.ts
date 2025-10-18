import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const saveRouteSchema = z.object({
  origin: z.string().min(1, 'origem é obrigatória').max(500, 'origem deve ter no máximo 500 caracteres'),
  destination: z.string().min(1, 'destino é obrigatório').max(500, 'destino deve ter no máximo 500 caracteres'),
  modality: z.enum(['road', 'mtb', 'general']),
  distanceKm: z.number().min(0, 'distância não pode ser negativa'),
  estimatedTimeMinutes: z.number().min(0, 'tempo estimado não pode ser negativo'),
  estimatedCalories: z.number().min(0, 'calorias não podem ser negativas'),
  elevationGain: z.number(),
  averageSpeedUsed: z.number().min(0, 'velocidade não pode ser negativa'),
  elevationLoss: z.number(),
  polyline: z.string(),
})

export class SaveRouteDto extends createZodDto(saveRouteSchema) {}
