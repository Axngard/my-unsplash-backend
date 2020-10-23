import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../user.service'
import {User, UserDocument, UserSchema} from '../schemas/user.schema'
import { getModelToken } from '@nestjs/mongoose'
import { MockUserModel } from './mocks/MockUserModel'
import { UserInterface } from '../interfaces/user'
import { ConflictException } from '@nestjs/common'
import { Model } from 'mongoose'

const correctSignUpData: UserInterface = {
  fullName: 'Axel Espinosa',
  username: 'axelespinosadev',
  password: 'Assseeef6a7!',
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
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Create Method', () => {
    it('should find a duplicated user', async () => {
      const userModelFindOneSpy = jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(User.bind(userStoredInDb))

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
  })
})
