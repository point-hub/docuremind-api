import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { type IAuth } from '@/modules/users/interface'
import { throwApiError } from '@/utils/throw-api-error'
import type { UniqueValidation } from '@/utils/unique-validation'

import type { IBorrowApproveDocumentRepository } from '../repositories/borrow-approve.repository'
import type { IRetrieveDocumentRepository } from '../repositories/retrieve.repository'

export interface IInput {
  auth: IAuth
  _id: string
  borrow_id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  borrowApproveDocumentRepository: IBorrowApproveDocumentRepository
  retrieveDocumentRepository: IRetrieveDocumentRepository
  createActivityRepository: ICreateActivityRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class BorrowApproveDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const responseRetrieve = await deps.retrieveDocumentRepository.handle(input._id)
    if (responseRetrieve.status !== 'available') {
      throwApiError(400, {
        message: "Cannot approve this data because it isn't available",
      })
    }
    const document = await deps.retrieveDocumentRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `approve request borrow for "${document.name}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.borrowApproveDocumentRepository.handle(input.borrow_id)
    // 2. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
