import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyOwnerOutput {
  deleted_count: number
}
export interface IDeleteManyOwnerRepository {
  handle(_ids: string[]): Promise<IDeleteManyOwnerOutput>
}

export class DeleteManyOwnerRepository implements IDeleteManyOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyOwnerOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
