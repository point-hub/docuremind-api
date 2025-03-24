import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyVaultOutput {
  deleted_count: number
}
export interface IDeleteManyVaultRepository {
  handle(_ids: string[]): Promise<IDeleteManyVaultOutput>
}

export class DeleteManyVaultRepository implements IDeleteManyVaultRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyVaultOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
