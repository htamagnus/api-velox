import { HttpStatus } from '@nestjs/common';
import { BaseAppError } from './base-error';

export class RideActivitiesNotFoundError extends BaseAppError {
  constructor() {
    super({
      message: 'Ride activities not found',
      status: HttpStatus.NOT_FOUND,
      code: 'RIDE_ACTIVITIES_NOT_FOUND',
    });
  }
}
