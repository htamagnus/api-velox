import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleRoutesNotFoundError extends HttpException {
  constructor() {
    super('No route found on Google Maps', HttpStatus.NOT_FOUND);
  }
}
