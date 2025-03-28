import { AppModule } from '@core/app.module'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
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
