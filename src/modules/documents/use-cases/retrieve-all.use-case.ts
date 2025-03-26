import type { IPagination, IQuery } from '@point-hub/papi'

import { type IRetrieveDocumentOutput } from '../repositories/retrieve.repository'
import { type IRetrieveAllDocumentRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllDocumentRepository: IRetrieveAllDocumentRepository
}

export interface IOutput {
  data: IRetrieveDocumentOutput[]
  pagination: IPagination
}

export class RetrieveAllDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllDocumentRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
