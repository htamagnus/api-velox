import { HttpStatus } from '@nestjs/common';
import { BaseAppError } from './base-error';

export class AverageSpeedNotSetError extends BaseAppError {
  constructor(modality: string) {
    super({
      message: `Average speed not set for modality: ${modality}`,
      status: HttpStatus.BAD_REQUEST,
      code: 'AVERAGE_SPEED_NOT_SET',
    });
  }
}
