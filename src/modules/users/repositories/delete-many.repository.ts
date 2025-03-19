import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyUserRepository {
  handle(_ids: string[]): Promise<IDeleteManyUserOutput>
}

export interface IDeleteManyUserOutput {
  deleted_count: number
}

export class DeleteManyUserRepository implements IDeleteManyUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyUserOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
