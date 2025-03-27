import { HttpStatus } from '@nestjs/common';
import { BaseAppError } from './base-error';

export class AthleteNotFoundError extends BaseAppError {
  constructor() {
    super({
      message: 'Athlete not found',
      status: HttpStatus.NOT_FOUND,
      code: 'ATHLETE_NOT_FOUND',
    });
  }
}
