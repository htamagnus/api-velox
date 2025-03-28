import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class InvalidTokenError extends BaseAppError {
  constructor(message = 'Token inválido. Faça login novamente.') {
    super({
      message,
      status: HttpStatus.UNAUTHORIZED,
      code: 'INVALID_TOKEN',
    })
  }
}
