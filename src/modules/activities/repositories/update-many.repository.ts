import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyActivityOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyActivityRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyActivityOutput>
}

export class UpdateManyActivityRepository implements IUpdateManyActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyActivityOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
