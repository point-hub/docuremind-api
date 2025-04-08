import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { type IDeleteOwnerRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
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
    const response = await deps.deleteOwnerRepository.handle(input._id)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
