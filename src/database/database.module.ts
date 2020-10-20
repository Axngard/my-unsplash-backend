import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationConstants } from '../config/configuration-constants';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = `mongodb+srv://${configService.get(
          ConfigurationConstants.DB_USERNAME,
        )}:${configService.get(
          ConfigurationConstants.DB_PASSWORD,
        )}@${configService.get(
          ConfigurationConstants.DB_HOST,
        )}/${configService.get(
          ConfigurationConstants.DB_NAME,
        )}?retryWrites=true&w=majority`;
        return { uri, useNewUrlParser: true };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
