import { HttpException, HttpStatus } from '@nestjs/common';

export class AthleteNotFoundError extends HttpException {
  constructor() {
    super('Athlete not found', HttpStatus.NOT_FOUND);
  }
}
