import type { IPagination, IQuery } from '@point-hub/papi'

import { type IRetrieveActivityOutput } from '../repositories/retrieve.repository'
import { type IRetrieveAllActivityRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllActivityRepository: IRetrieveAllActivityRepository
}

export interface IOutput {
  data: IRetrieveActivityOutput[]
  pagination: IPagination
}

export class RetrieveAllActivityUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllActivityRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
