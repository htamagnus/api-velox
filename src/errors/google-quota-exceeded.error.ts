import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class GoogleQuotaExceededError extends BaseAppError {
  constructor(googleStatus: string) {
    super({
      message: 'Google Maps daily quota reached. Try again tomorrow.',
      status: HttpStatus.SERVICE_UNAVAILABLE,
      code: 'GOOGLE_QUOTA_EXCEEDED',
      context: { googleStatus },
    })
  }
}
