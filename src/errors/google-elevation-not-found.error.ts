import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class GoogleElevationNotFoundError extends BaseAppError {
  constructor() {
    super({
      message: 'Error fetching elevation data from Google Maps.',
      status: HttpStatus.BAD_GATEWAY,
      code: 'GOOGLE_ELEVATION_NOT_FOUND',
    })
  }
}
