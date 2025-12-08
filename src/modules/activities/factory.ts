import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { type IActivityEntity } from './interface'
import { CreateActivityRepository } from './repositories/create.repository'
import { CreateManyActivityRepository } from './repositories/create-many.repository'

export default class ActivityFactory extends BaseFactory<IActivityEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_at: new Date(),
    }
  }

  async create() {
    const createActivityRepository = new CreateActivityRepository(this.dbConnection)
    return await createActivityRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyActivityRepository = new CreateManyActivityRepository(this.dbConnection)
    return await createManyActivityRepository.handle(this.makeMany(count))
  }
}
