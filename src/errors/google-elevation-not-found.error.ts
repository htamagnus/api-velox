import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleElevationNotFoundError extends HttpException {
  constructor() {
    super(
      'Error fetching elevation data from Google Maps',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
