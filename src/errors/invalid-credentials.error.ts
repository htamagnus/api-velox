import { HttpStatus } from '@nestjs/common';
import { BaseAppError } from './base-error';

export class InvalidCredentialsError extends BaseAppError {
  constructor() {
    super({
      message: 'Invalid Credentials. Please provide valid credentials.',
      status: HttpStatus.BAD_REQUEST,
      code: 'INVALID_CREDENTIALS',
    });
  }
}
