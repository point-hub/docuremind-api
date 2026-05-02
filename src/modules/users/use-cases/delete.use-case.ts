import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'

import type { IAuth } from '../interface'
import type { IDeleteUserRepository } from '../repositories/delete.repository'
import type { IRetrieveUserRepository } from '../repositories/retrieve.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  auth: IAuth
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteUserRepository: IDeleteUserRepository
  retrieveUserRepository: IRetrieveUserRepository
  createActivityRepository: ICreateActivityRepository
}

export interface IOutput {
  deleted_count: number
}

export class DeleteUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const user = await deps.retrieveUserRepository.handle(input._id)
    if (!user) {
      throw new Error('User not found')
    }
    const response = await deps.deleteUserRepository.handle(input._id)
    if (response.deleted_count > 0) {
      await deps.createActivityRepository.handle({
        notes: `deleted user ${user.username}`,
        user: {
          _id: input.auth._id,
          label: input.auth.name,
          email: input.auth.email,
        },
        date: new Date(),
      })
    }
    return { deleted_count: response.deleted_count }
  }
}
