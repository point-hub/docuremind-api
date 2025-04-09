import { tokenGenerate } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import type { IBorrowDocumentRepository } from '../repositories/borrow.repository'
import { borrowValidation } from '../validations/borrow.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    reason_for_borrowing: string
    required_date: string
    return_due_date: string
    requested_by: {
      _id: string
      label: string
      email: string
    }
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  borrowDocumentRepository: IBorrowDocumentRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class BorrowDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
    input.data = JSON.parse(JSON.stringify(input.data))
    // 1. validate schema
    await deps.schemaValidation(input.data, borrowValidation)
    // 2. define entity
    const documentEntity = {
      _id: tokenGenerate(),
      reason_for_borrowing: input.data.reason_for_borrowing,
      required_date: input.data.required_date,
      return_due_date: input.data.return_due_date,
      requested_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      requested_at: new Date(),
      status: 'pending',
    }

    // 3. database operation
    const response = await deps.borrowDocumentRepository.handle(input._id, documentEntity)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
