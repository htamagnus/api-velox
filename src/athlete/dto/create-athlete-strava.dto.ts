import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createAthleteFromStravaDto = z.object({
  code: z.string(),
});

export class CreateAthleteFromStravaDto extends createZodDto(
  createAthleteFromStravaDto,
) {}
