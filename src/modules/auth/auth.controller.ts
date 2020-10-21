import {Body, Controller, Post} from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import {AuthService} from "./auth.service";
import {ApiOkResponse} from "@nestjs/swagger";
import {SignInResponseDto} from "./dtos/sign-in-response.dto";

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService){}

    @Post('login')
    @ApiOkResponse({ description: 'Generates a JWT to perform requests', type: SignInResponseDto})
    signIn(@Body() signIn: SignInDto) {
        return this.authService.signIn(signIn)
    }
}
