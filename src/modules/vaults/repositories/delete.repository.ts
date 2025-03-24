import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteVaultOutput {
  deleted_count: number
}
export interface IDeleteVaultRepository {
  handle(_id: string): Promise<IDeleteVaultOutput>
}

export class DeleteVaultRepository implements IDeleteVaultRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteVaultOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
