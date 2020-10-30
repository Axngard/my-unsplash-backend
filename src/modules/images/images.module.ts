import { BadRequestException, Module } from '@nestjs/common'
import { ImagesController } from './images.controller'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
    MulterModule.register({
      dest: `${__dirname}/uploads`,
      fileFilter: (req, file, cb) => {
        console.log(file)
        console.log(file.mimetype)
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new BadRequestException('mimetype_not_allowed'), false)
        }
      },
    }),
  ],
  controllers: [ImagesController],
})
export class ImagesModule {}
