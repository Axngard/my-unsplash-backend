import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigurationConstants } from '../../../config/configuration-constants'
import { JwtInterface } from '../interfaces/jwt.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigurationConstants.JWT_SECRET),
    })
  }

  async validate(payload: JwtInterface) {
    const { username, userId } = payload
    return { userId, username }
  }
}
