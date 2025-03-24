import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateVaultOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateVaultRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateVaultOutput>
}

export class UpdateVaultRepository implements IUpdateVaultRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateVaultOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
