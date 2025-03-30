import { createZodDto } from 'nestjs-zod'
import { passwordValidationMessage, strongPasswordRegex } from 'src/utils'
import { z } from 'zod'

const registerAthleteSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(strongPasswordRegex, passwordValidationMessage),
})

const registerAndLoginAthleteResponseDto = z.object({
  token: z.string(),
  expiresIn: z.number(),
  athleteId: z.string(),
})

export class RegisterAthleteDto extends createZodDto(registerAthleteSchema) {}
export class RegisterAndLoginAthleteDto extends createZodDto(registerAndLoginAthleteResponseDto) {}
