import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../user/user.service'
import { UserServiceMock } from './mocks/user-service-mock'
import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'
import { JwtServiceMock } from './mocks/jwt-service-mock'
import { SignInDto } from '../dtos/signin.dto'
import { UnauthorizedException } from '@nestjs/common'

const userStoredInDb = {
  totalTimeSpent: 0,
  fullName: 'Axel Espinosa',
  username: 'axelespinosadev',
  password: '$2b$10$iK3d8VkQeVdso6Yjsk5M/eLtuDR3/fbB8yPRGKAxDKuTLAI3gCOZu',
  email: 'axeldavid45@gmail.com',
  createdAt: new Date(),
}

const correctSignInInformation: SignInDto = {
  username: 'axelespinosadev',
  password: 'AxelDavid45!',
}

const wrongUsernameSignInInformation: SignInDto = {
  username: 'axelespinosadez',
  password: 'AxelDavid45!',
}

const wrongPasswordSignInInformation: SignInDto = {
  username: 'axelespinosadev',
  password: 'AxelDavid45',
}

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useClass: UserServiceMock,
        },
        {
          provide: JwtService,
          useClass: JwtServiceMock,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('ValidateUser method', () => {
    it('should find the user with correct password and return the user information', async () => {
      const userServiceFindOne = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(userStoredInDb)

      const validate = await service.validateUser(correctSignInInformation)

      expect(userServiceFindOne).toHaveBeenCalledWith(
        correctSignInInformation.username,
      )

      expect(validate).toBe(userStoredInDb)
    })

    it('should not find the user', async () => {
      const userServiceFindOneError = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(null)

      try {
        await service.validateUser(wrongUsernameSignInInformation)
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException)
        expect(err.message).toBe('verify_credentials')
        expect(userServiceFindOneError).toHaveBeenCalledWith(
          wrongUsernameSignInInformation.username,
        )
      }
    })

    it('should find the user but incorrect password', async () => {
      const userServiceFindOne = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(userStoredInDb)

      try {
        await service.validateUser(wrongPasswordSignInInformation)
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException)
        expect(err.message).toBe('verify_credentials')
        expect(userServiceFindOne).toHaveBeenCalledWith(
          wrongPasswordSignInInformation.username,
        )
      }
    })
  })
})
