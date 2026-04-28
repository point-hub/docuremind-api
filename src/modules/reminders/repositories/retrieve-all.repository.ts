import type { IDatabase, IPagination, IQuery } from '@point-hub/papi'
import { collectionName } from '../entity'
import type { IReminderEntity } from '../interface'

export interface IRetrieveAllReminderOutput {
  data: IReminderEntity[]
  pagination: IPagination
}

export interface IRetrieveAllReminderRepository {
  handle(query: IQuery): Promise<IRetrieveAllReminderOutput>
}

export class RetrieveAllReminderRepository implements IRetrieveAllReminderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllReminderOutput> {
    const response = await this.database.collection(collectionName).retrieveAll(query, this.options)

    return {
      data: response.data as unknown as IReminderEntity[],
      pagination: response.pagination,
    }
  }
}
