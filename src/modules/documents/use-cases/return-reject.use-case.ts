import type { ISchemaValidation } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import type { IRetrieveDocumentRepository } from '../repositories/retrieve.repository'
import type { IReturnRejectDocumentRepository } from '../repositories/return-reject.repository'

export interface IInput {
  auth: IAuth
  _id: string
  return_id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  returnRejectDocumentRepository: IReturnRejectDocumentRepository
  retrieveDocumentRepository: IRetrieveDocumentRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ReturnRejectDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const document = await deps.retrieveDocumentRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `rejected the return request for document ${document.code}`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.returnRejectDocumentRepository.handle(input.return_id)
    // 2. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
