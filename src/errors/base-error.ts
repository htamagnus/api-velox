import { HttpException, HttpStatus } from '@nestjs/common'

export interface AppErrorOptions {
  message: string
  status?: HttpStatus
  code?: string
  context?: Record<string, any>
}

export class BaseAppError extends HttpException {
  public readonly code?: string
  public readonly context?: Record<string, any>

  constructor({ message, status = HttpStatus.BAD_REQUEST, code, context }: AppErrorOptions) {
    super(
      {
        message,
        code,
        status,
        context,
      },
      status,
    )
    if (code !== undefined) this.code = code
    if (context !== undefined) this.context = context
  }
}
