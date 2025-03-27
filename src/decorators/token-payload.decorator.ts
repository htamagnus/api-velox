import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const tokenPayloadSchema = z.object({
  athleteId: z.string(),
});

export const Token = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.user;

    return tokenPayloadSchema.parse(payload);
  },
);

export class TokenPayloadDto extends createZodDto(tokenPayloadSchema) {}
