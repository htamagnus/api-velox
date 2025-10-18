import { createZodDto } from 'nestjs-zod'
import { passwordValidationMessage, strongPasswordRegex } from 'src/utils'
import { z } from 'zod'

const registerAthleteSchema = z.object({
  name: z.string().min(1, 'nome é obrigatório').max(255, 'nome deve ter no máximo 255 caracteres'),
  email: z.string().email().max(255, 'email deve ter no máximo 255 caracteres'),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .max(255, 'senha deve ter no máximo 255 caracteres')
    .regex(strongPasswordRegex, passwordValidationMessage),
})

const registerAndLoginAthleteResponseDto = z.object({
  token: z.string(),
  expiresIn: z.number(),
  athleteId: z.string(),
})

export class RegisterAthleteDto extends createZodDto(registerAthleteSchema) {}
export class RegisterAndLoginAthleteDto extends createZodDto(registerAndLoginAthleteResponseDto) {}
