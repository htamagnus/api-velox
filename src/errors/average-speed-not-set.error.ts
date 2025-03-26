import { HttpException, HttpStatus } from '@nestjs/common';

export class AverageSpeedNotSetError extends HttpException {
  constructor(modality: string) {
    super(
      `Average speed not set for modality: ${modality}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
