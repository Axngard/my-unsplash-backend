import {ApiProperty} from "@nestjs/swagger";

export class InformativeResponseDto {
  @ApiProperty({
    example: 201
  })
  statusCode: number;
  @ApiProperty({
    example: 'user_created'
  })
  message: string;
}
