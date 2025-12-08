import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import type { IAuth } from '@/modules/users/interface'
import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { type IDeleteDocumentRepository } from '../repositories/delete.repository'
import type { IRetrieveDocumentRepository } from '../repositories/retrieve.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  auth: IAuth
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveDocumentRepository: IRetrieveDocumentRepository
  createActivityRepository: ICreateActivityRepository
  deleteDocumentRepository: IDeleteDocumentRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export interface IOutput {
  deleted_count: number
}

export class DeleteDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship

    // 3. database operation
    const document = await deps.retrieveDocumentRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `delete document "${document.name}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.deleteDocumentRepository.handle(input._id)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
