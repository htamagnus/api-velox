import { AppModule } from '@core/app.module'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
  app.useGlobalInterceptors(new LoggerInterceptor())
  const configService = app.get(ConfigService)

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
