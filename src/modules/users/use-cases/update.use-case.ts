import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, UserEntity } from '../entity'
import type { IAuth } from '../interface'
import type { IRetrieveUserRepository } from '../repositories/retrieve.repository'
import type { IUpdateUserRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  auth: IAuth
  data: {
    name?: string
    username?: string
    email?: string
    role?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateUserRepository: IUpdateUserRepository
  uniqueValidation: IUniqueValidation
  retrieveUserRepository: IRetrieveUserRepository
  createActivityRepository: ICreateActivityRepository
  objClean: IObjClean
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { username: input.data.username }, input._id)
    await deps.uniqueValidation.handle(collectionName, { name: input.data.name }, input._id)
    // 2. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 3. define entity
    const userEntity = new UserEntity({
      username: input.data.username,
      email: input.data.email,
      name: input.data.name,
      role: input.data.role,
      updated_at: new Date(),
    })
    userEntity.data = deps.objClean(userEntity.data)
    // 4. database operation
    const user = await deps.retrieveUserRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `updated "${user.name}" role from "${user.role}" to "${input.data.role}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data)
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
