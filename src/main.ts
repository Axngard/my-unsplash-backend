import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigurationConstants } from './config/configuration-constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configures the port
  const configService = app.get(ConfigService);
  const PORT = configService.get(ConfigurationConstants.PORT);

  // Configures a prefix before every endpoint
  app.setGlobalPrefix('api');

  // Configures a validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Wired a port to the app
  await app.listen(PORT);
}
bootstrap();
