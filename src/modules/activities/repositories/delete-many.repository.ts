import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyActivityOutput {
  deleted_count: number
}
export interface IDeleteManyActivityRepository {
  handle(_ids: string[]): Promise<IDeleteManyActivityOutput>
}

export class DeleteManyActivityRepository implements IDeleteManyActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyActivityOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
