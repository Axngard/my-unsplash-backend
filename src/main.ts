import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {ConfigurationConstants} from "./config/configuration-constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const PORT = configService.get(ConfigurationConstants.PORT)
  await app.listen(PORT);
}
bootstrap();
