import type { ISchemaValidation } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import type { IReturnDocumentRepository } from '../repositories/return.repository'

export interface IInput {
  auth: IAuth
  _id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  returnDocumentRepository: IReturnDocumentRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ReturnDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    // await deps.schemaValidation(input.data, returnValidation)
    // 2. define entity
    // 3. database operation
    const response = await deps.returnDocumentRepository.handle(input._id)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
