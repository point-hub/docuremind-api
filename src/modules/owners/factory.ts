import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { type IOwnerEntity } from './interface'
import { CreateOwnerRepository } from './repositories/create.repository'
import { CreateManyOwnerRepository } from './repositories/create-many.repository'

export default class OwnerFactory extends BaseFactory<IOwnerEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_at: new Date(),
    }
  }

  async create() {
    const createOwnerRepository = new CreateOwnerRepository(this.dbConnection)
    return await createOwnerRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyOwnerRepository = new CreateManyOwnerRepository(this.dbConnection)
    return await createManyOwnerRepository.handle(this.makeMany(count))
  }
}
