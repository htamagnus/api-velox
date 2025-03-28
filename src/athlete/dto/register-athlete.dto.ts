import { createZodDto } from 'nestjs-zod'
import { passwordValidationMessage, strongPasswordRegex } from 'src/utils'
import { z } from 'zod'

const registerAthleteSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(strongPasswordRegex, passwordValidationMessage),
})

export class RegisterAthleteDto extends createZodDto(registerAthleteSchema) {}
