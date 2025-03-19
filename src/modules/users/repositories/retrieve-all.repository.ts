import type { IDatabase, IPagination, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { type IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveAllUserRepository {
  handle(query: IQuery): Promise<IRetrieveAllUserOutput>
}

export interface IRetrieveAllUserOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}

export class RetrieveAllUserRepository implements IRetrieveAllUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllUserOutput> {
    const response = await this.database.collection(collectionName).retrieveAll(query, this.options)
    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
