import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class EmailAlreadyExistsError extends BaseAppError {
  constructor() {
    super({
      message: 'The email provided is already in use. Please provide a different email.',
      status: HttpStatus.BAD_REQUEST,
      code: 'EMAIL_ALREADY_EXISTS',
    })
  }
}
