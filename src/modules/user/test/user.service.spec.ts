import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../user.service'
import { User, UserDocument } from '../schemas/user.schema'
import { getModelToken } from '@nestjs/mongoose'
import { MockUserModel } from './mocks/MockUserModel'
import { UserInterface } from '../interfaces/user'
import {BadRequestException, ConflictException} from '@nestjs/common'
import { Model } from 'mongoose'
import exp from "constants";

const correctSignUpData: UserInterface = {
  fullName: 'Axel Espinosa',
  username: 'axelespinosadev',
  password: 'Assseeef6a7!',
  email: 'test@test.com',
}

const incorrectSignUpData: UserInterface = {
  fullName: 'Axel Espinosa',
  username: 'axelespinosadev2',
  password: 'As6a!',
  email: 'test@test.com',
}

const userStoredInDb = {
  totalTimeSpent: 0,
  fullName: 'Axel Espinosa',
  username: 'axelespinosadev',
  password: '$2b$10$iK3d8VkQeVdso6Yjsk5M/eLtuDR3/fbB8yPRGKAxDKuTLAI3gCOZu',
  email: 'axeldavid45@gmail.com',
  createdAt: new Date(),
}

describe('UserService Tests', () => {
  let service: UserService
  let userModel: Model<UserDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useClass: MockUserModel,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userModel = module.get(getModelToken(User.name))
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Create Method', () => {
    it('should find a duplicated user', async () => {
      const userModelFindOneSpy = jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(Object.create(userStoredInDb))

      try {
        await service.create(correctSignUpData)
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        expect(err.message).toBe('user_duplicated')
        expect(userModelFindOneSpy).toBeCalledWith({
          username: correctSignUpData.username,
        })
      }
    })

    it('should not allow the password', async () => {
      const userModelFindOneSpy = jest
          .spyOn(userModel, 'findOne')
          .mockResolvedValue(null)

      try {
        await service.create(incorrectSignUpData)
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException)
        expect(err.message).toBe('weak_password')
        expect(userModelFindOneSpy).toHaveBeenCalled()
        expect(userModelFindOneSpy).toBeCalledWith({
          username: incorrectSignUpData.username,
        })
      }
    })
  })
})
