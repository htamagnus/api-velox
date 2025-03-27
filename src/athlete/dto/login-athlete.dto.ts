import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginAthleteDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

const loginAthleteResponseDto = z.object({
  token: z.string(),
  expiresIn: z.number(),
  athleteId: z.string(),
});

export class LoginAthleteDto extends createZodDto(loginAthleteDto) {}
export class LoginAthleteResponseDto extends createZodDto(
  loginAthleteResponseDto,
) {}
