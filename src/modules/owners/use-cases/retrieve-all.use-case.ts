import type { IPagination, IQuery } from '@point-hub/papi'

import { type IRetrieveOwnerOutput } from '../repositories/retrieve.repository'
import { type IRetrieveAllOwnerRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllOwnerRepository: IRetrieveAllOwnerRepository
}

export interface IOutput {
  data: IRetrieveOwnerOutput[]
  pagination: IPagination
}

export class RetrieveAllOwnerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllOwnerRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
