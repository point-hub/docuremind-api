import type { IQuery } from '@point-hub/papi'

import type { IRetrieveUserOutput } from '../repositories/retrieve.repository'
import type { IRetrieveAllUserRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllUserRepository: IRetrieveAllUserRepository
}

export interface IOutput {
  data: IRetrieveUserOutput[]
  pagination: {
    page: number
    page_count: number
    page_size: number
    total_document: number
  }
}

export class RetrieveAllUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllUserRepository.handle(input.query)
    console.log(response)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
