import { HttpStatus } from '@nestjs/common'

import { BaseAppError } from './base-error'

export class SavedRouteNotFoundError extends BaseAppError {
  constructor() {
    super({
      message: 'Saved route not found',
      status: HttpStatus.NOT_FOUND,
      code: 'SAVED_ROUTE_NOT_FOUND',
    })
  }
}
