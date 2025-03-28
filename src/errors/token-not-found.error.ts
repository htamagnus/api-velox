import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class TokenNotFoundError extends BaseAppError {
  constructor() {
    super({
      message: 'Token não fornecido na requisição.',
      status: HttpStatus.UNAUTHORIZED,
      code: 'TOKEN_NOT_FOUND',
    })
  }
}
