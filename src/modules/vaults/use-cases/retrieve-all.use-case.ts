import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveVaultOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllVaultRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllVaultRepository: IRetrieveAllVaultRepository
}

export interface IOutput {
  data: IRetrieveVaultOutput[]
  pagination: IPagination
}

export class RetrieveAllVaultUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllVaultRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
