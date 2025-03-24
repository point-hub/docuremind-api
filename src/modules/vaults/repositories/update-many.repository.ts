import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyVaultOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyVaultRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyVaultOutput>
}

export class UpdateManyVaultRepository implements IUpdateManyVaultRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyVaultOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
