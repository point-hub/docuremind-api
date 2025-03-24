import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, UserEntity } from '../entity'
import type { ICreateUserRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  username?: string
  email?: string
  password?: string
  role?: string
}

export interface IDeps {
  createUserRepository: ICreateUserRepository
  schemaValidation: ISchemaValidation
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_id: string
}

export class CreateUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { name: input.name })
    // 2. validate schema
    await deps.schemaValidation(input, createValidation)
    // 3. define entity
    const userEntity = new UserEntity({
      name: input.name,
      username: input.username,
      email: input.email,
      password: input.password,
      role: input.role,
      created_at: new Date(),
    })
    userEntity.trimmedEmail()
    userEntity.trimmedUsername()
    // 4. database operation
    const response = await deps.createUserRepository.handle(userEntity.data)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
