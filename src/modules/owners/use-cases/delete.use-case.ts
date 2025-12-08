import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import type { IAuth } from '@/modules/users/interface'
import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { type IDeleteOwnerRepository } from '../repositories/delete.repository'
import type { IRetrieveOwnerRepository } from '../repositories/retrieve.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  auth: IAuth
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveOwnerRepository: IRetrieveOwnerRepository
  createActivityRepository: ICreateActivityRepository
  deleteOwnerRepository: IDeleteOwnerRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export interface IOutput {
  deleted_count: number
}

export class DeleteOwnerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const hasRelationship = await deps.deleteOwnerRepository.hasRelationship(input._id)
    if (hasRelationship) {
      deps.throwApiError(400, {
        message: 'Cannot delete this data because it is referenced in another document',
      })
    }
    // 3. database operation
    const owner = await deps.retrieveOwnerRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `deleted owner "${owner.name}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.deleteOwnerRepository.handle(input._id)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
