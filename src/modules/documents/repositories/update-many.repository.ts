import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyDocumentRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyDocumentOutput>
}

export class UpdateManyDocumentRepository implements IUpdateManyDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyDocumentOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
