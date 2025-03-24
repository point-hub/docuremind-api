import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyOwnerOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyOwnerRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyOwnerOutput>
}

export class UpdateManyOwnerRepository implements IUpdateManyOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyOwnerOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
