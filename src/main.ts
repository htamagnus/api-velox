import { AppModule } from '@core/app.module'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const allowedOriginsEnv = configService.get<string>('ALLOWED_ORIGINS')
  const allowedOrigins = allowedOriginsEnv ? allowedOriginsEnv.split(',') : ['http://localhost:3001']

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })
  app.useGlobalInterceptors(new LoggerInterceptor())

  const port = configService.getOrThrow<number>('PORT')

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Velox API')
    .setDescription('API para planejamento e salvamento de rotas de ciclismo')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(port)
}
bootstrap()
