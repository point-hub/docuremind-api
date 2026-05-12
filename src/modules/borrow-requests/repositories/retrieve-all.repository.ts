import type { IDatabase, IPagination, IQuery } from '@point-hub/papi'
import { collectionName } from '../entity'
import type { IBorrowRequestEntity } from '../interface'

export interface IRetrieveAllBorrowRequestOutput {
  data: IBorrowRequestEntity[]
  pagination: IPagination
}

export interface IRetrieveAllBorrowRequestRepository {
  handle(query: IQuery): Promise<IRetrieveAllBorrowRequestOutput>
}

export class RetrieveAllBorrowRequestRepository implements IRetrieveAllBorrowRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllBorrowRequestOutput> {
    const response = await this.database.collection(collectionName).retrieveAll(query, this.options)

    return {
      data: response.data as unknown as IBorrowRequestEntity[],
      pagination: response.pagination,
    }
  }
}
