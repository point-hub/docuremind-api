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
    console.log(input)
    const response = await deps.borrowRejectDocumentRepository.handle(input.borrow_id)
    console.log(response)
    // 2. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
