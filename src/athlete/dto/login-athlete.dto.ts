import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const loginAthleteDto = z.object({
  email: z.string().email().max(255, 'email deve ter no máximo 255 caracteres'),
  password: z.string().min(1, 'password é obrigatório').max(255, 'password deve ter no máximo 255 caracteres'),
})

const loginAthleteResponseDto = z.object({
  token: z.string(),
  expiresIn: z.number(),
  athleteId: z.string(),
  hasCompletedOnboarding: z.boolean().optional(),
})

export class LoginAthleteDto extends createZodDto(loginAthleteDto) {}
export class LoginAthleteResponseDto extends createZodDto(loginAthleteResponseDto) {}
