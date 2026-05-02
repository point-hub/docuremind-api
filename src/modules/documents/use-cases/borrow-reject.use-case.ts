import type { ISchemaValidation } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import type { IBorrowRejectDocumentRepository } from '../repositories/borrow-reject.repository'

export interface IInput {
  auth: IAuth
  _id: string
  borrow_id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  borrowRejectDocumentRepository: IBorrowRejectDocumentRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class BorrowRejectDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.borrowRejectDocumentRepository.handle(input.borrow_id)
    if (response.modified_count > 0) {
      const document = await deps.retrieveDocumentRepository.handle(input._id)
      await deps.createActivityRepository.handle({
        notes: `rejected the borrow request for document ${document.code}`,
        user: {
          _id: input.auth._id,
          label: input.auth.name,
          email: input.auth.email,
        },
        date: new Date(),
      })
    }
    // 2. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
