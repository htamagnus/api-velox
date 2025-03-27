import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginAthleteDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class LoginAthleteDto extends createZodDto(loginAthleteDto) {}
