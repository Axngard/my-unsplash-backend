import {Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post()
    signUp(@Body() userData: CreateUserDto) {
        return this.userService.create(userData)
    }
}
