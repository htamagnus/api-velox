import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const updateAthleteDto = z.object({
  name: z.string().min(1, 'nome não pode ser vazio').max(255, 'nome deve ter no máximo 255 caracteres').optional(),
  age: z.number().min(1, 'idade deve ser maior que 0').max(150, 'idade deve ser menor que 150').optional(),
  weight: z.number().min(1, 'peso deve ser maior que 0').max(500, 'peso deve ser menor que 500kg').optional(),
  height: z.number().min(1, 'altura deve ser maior que 0').max(300, 'altura deve ser menor que 300cm').optional(),
  averageSpeedRoad: z.number().min(0, 'velocidade não pode ser negativa').max(200, 'velocidade deve ser menor que 200km/h').optional(),
  averageSpeedMtb: z.number().min(0, 'velocidade não pode ser negativa').max(200, 'velocidade deve ser menor que 200km/h').optional(),
  averageSpeedGeneral: z.number().min(0, 'velocidade não pode ser negativa').max(200, 'velocidade deve ser menor que 200km/h').optional(),
})

export class UpdateAthleteDto extends createZodDto(updateAthleteDto) {}
