import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InformativeResponseDto } from '../../dtos/informative-response.dto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'Create a user',
    type: InformativeResponseDto,
  })
  @ApiConflictResponse({
    description: 'A user with the same username already exists',
  })
  @ApiBadRequestResponse({ description: 'Weak password' })
  signUp(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }
}
