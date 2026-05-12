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
    })
    const user = await deps.retrieveUserRepository.handle(input._id)
    if (!user) {
      throw new Error('User not found')
    }

    const isChanged =
      (input.data.name && input.data.name !== user.name) ||
      (input.data.username && input.data.username !== user.username) ||
      (input.data.email && input.data.email !== user.email) ||
      (input.data.role && input.data.role !== user.role)

    if (isChanged) {
      userEntity.data.updated_at = new Date()
    } else {
      delete userEntity.data.updated_at
    }

    userEntity.data = deps.objClean(userEntity.data)
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data)
    if (response.modified_count > 0) {
      await deps.createActivityRepository.handle({
        notes: `updated user ${user.username}`,
        user: {
          _id: input.auth._id,
          label: input.auth.name,
          email: input.auth.email,
        },
        date: new Date(),
      })
    }
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
