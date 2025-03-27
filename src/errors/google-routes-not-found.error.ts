import { HttpStatus } from '@nestjs/common';
import { BaseAppError } from './base-error';

export class GoogleRoutesNotFoundError extends BaseAppError {
  constructor() {
    super({
      message: 'No route found on Google Maps.',
      status: HttpStatus.NOT_FOUND,
      code: 'GOOGLE_ROUTES_NOT_FOUND',
    });
  }
}
