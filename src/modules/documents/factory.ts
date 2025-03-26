import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { type IDocumentEntity } from './interface'
import { CreateDocumentRepository } from './repositories/create.repository'
import { CreateManyDocumentRepository } from './repositories/create-many.repository'

export default class DocumentFactory extends BaseFactory<IDocumentEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_at: new Date(),
    }
  }

  async create() {
    const createDocumentRepository = new CreateDocumentRepository(this.dbConnection)
    return await createDocumentRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyDocumentRepository = new CreateManyDocumentRepository(this.dbConnection)
    return await createManyDocumentRepository.handle(this.makeMany(count))
  }
}
