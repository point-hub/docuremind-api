import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateOwnerRepository } from './repositories/create.repository'

export interface ISeed {
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] owners data`)
  // prepare repository
  const createOwnerRepository = new CreateOwnerRepository(dbConnection, options)
  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    await createOwnerRepository.handle(seed)
  }
}
