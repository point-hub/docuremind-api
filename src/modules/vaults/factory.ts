import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IVaultEntity } from './interface'
import { CreateVaultRepository } from './repositories/create.repository'
import { CreateManyVaultRepository } from './repositories/create-many.repository'

export default class VaultFactory extends BaseFactory<IVaultEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_at: new Date(),
    }
  }

  async create() {
    const createVaultRepository = new CreateVaultRepository(this.dbConnection)
    return await createVaultRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyVaultRepository = new CreateManyVaultRepository(this.dbConnection)
    return await createManyVaultRepository.handle(this.makeMany(count))
  }
}
