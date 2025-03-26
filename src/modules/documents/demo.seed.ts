import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateDocumentRepository } from './repositories/create.repository'

export interface ISeed {
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] documents data`)
  // prepare repository
  const createDocumentRepository = new CreateDocumentRepository(dbConnection, options)
  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    await createDocumentRepository.handle(seed)
  }
}
