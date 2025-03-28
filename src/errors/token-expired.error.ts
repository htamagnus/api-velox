import { BaseAppError } from '@errors/base-error'
import { HttpStatus } from '@nestjs/common'

export class TokenExpiredError extends BaseAppError {
  constructor() {
    super({
      message: 'Seu token expirou. Por favor, faça login novamente.',
      status: HttpStatus.UNAUTHORIZED,
      code: 'TOKEN_EXPIRED',
    })
  }
}
