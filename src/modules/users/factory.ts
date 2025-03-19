import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { type IUserEntity } from './interface'
import { CreateUserRepository } from './repositories/create.repository'
import { CreateManyUserRepository } from './repositories/create-many.repository'

export default class UserFactory extends BaseFactory<IUserEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_at: new Date(),
    }
  }

  async create() {
    const createRepository = new CreateUserRepository(this.dbConnection)
    return await createRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyUserRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
