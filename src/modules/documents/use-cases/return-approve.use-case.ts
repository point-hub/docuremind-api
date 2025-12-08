import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import type { IRetrieveDocumentRepository } from '../repositories/retrieve.repository'
import type { IReturnApproveDocumentRepository } from '../repositories/return-approve.repository'

export interface IInput {
  auth: IAuth
  _id: string
  return_id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  returnApproveDocumentRepository: IReturnApproveDocumentRepository
  retrieveDocumentRepository: IRetrieveDocumentRepository
  createActivityRepository: ICreateActivityRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ReturnApproveDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const document = await deps.retrieveDocumentRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `request borrow for "${document.name}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.returnApproveDocumentRepository.handle(input.return_id)
    // 2. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
