import { HttpException, HttpStatus } from '@nestjs/common';

export class RideActivitiesNotFoundError extends HttpException {
  constructor() {
    super('Ride activities not found', HttpStatus.NOT_FOUND);
  }
}
