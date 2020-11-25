import { InformativeResponseDto } from '../../../dtos/informative-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Images } from '../schemas/images.schema'
export class ImagesListResponse extends InformativeResponseDto {
  @ApiProperty({ type: [Images] })
  data: Images[]
}
