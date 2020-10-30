import { Module } from '@nestjs/common'
import { ImagesController } from './images.controller'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
    MulterModule.register({
      dest: '/uploads',
    }),
  ],
  controllers: [ImagesController],
})
export class ImagesModule {}
