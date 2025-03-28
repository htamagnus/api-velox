import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common'
import { Observable, catchError, tap, throwError } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, originalUrl, ip } = request
    const now = Date.now()

    this.logger.log(`Request  → ${method} ${originalUrl} [${ip}]`)

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse()
        const statusCode = response.statusCode
        const ms = Date.now() - now
        this.logger.log(`Response ← ${method} ${originalUrl} ${statusCode} (${ms}ms) [${ip}]`)
      }),
      catchError(err => {
        const response = context.switchToHttp().getResponse()
        const statusCode = response.statusCode || err.status || 500
        const ms = Date.now() - now
        this.logger.error(`Response ← ${method} ${originalUrl} ${statusCode} (${ms}ms) [${ip}]`)
        return throwError(() => err)
      }),
    )
  }
}
