import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class StravaIdAlreadyExistsError extends BaseAppError {
  constructor() {
    super({
      message: 'This Strava user is already linked to another account.',
      status: HttpStatus.CONFLICT,
      code: 'STRAVA_ID_ALREADY_EXISTS',
    })
  }
}
