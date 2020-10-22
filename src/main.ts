import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ConfigurationConstants } from './config/configuration-constants'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Configures the port
  const configService = app.get(ConfigService)
  const PORT = configService.get(ConfigurationConstants.PORT)

  // Configures a prefix before every endpoint
  app.setGlobalPrefix('api')

  // Configures a validation pipe
  app.useGlobalPipes(new ValidationPipe())

  // Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('My Unsplash By  Cutting Edge Coders')
    .setDescription('Solution for a challenge from devchallenges.io.')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  // CORS security
  app.enableCors()

  // Wired a port to the app
  await app.listen(PORT)
}
bootstrap()
