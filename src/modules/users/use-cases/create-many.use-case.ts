import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, UserEntity } from '../entity'
import type { ICreateManyUserRepository } from '../repositories/create-many.repository'
import { createManyValidation } from '../validations/create-many.validation'

export interface IInput {
  users: {
    name?: string
    phone?: string
  }[]
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  createManyUserRepository: ICreateManyUserRepository
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_count: number
  inserted_ids: string[]
}

export class CreateManyUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation({ users: input.users }, createManyValidation)
    // 2. define entity
    const entities = []
    for (const document of input.users) {
      // 3. validate unique
      await deps.uniqueValidation.handle(collectionName, { name: document.name })
      const userEntity = new UserEntity({
        name: document.name,
      })
      userEntity.data = deps.objClean(userEntity.data)
      entities.push(userEntity.data)
    }
    // 4. database operation
    const response = await deps.createManyUserRepository.handle(entities)
    // 5. output
    return {
      inserted_ids: response.inserted_ids,
      inserted_count: response.inserted_count,
    }
  }
}
