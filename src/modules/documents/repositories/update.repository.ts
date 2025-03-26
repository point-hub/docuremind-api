import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateDocumentRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateDocumentOutput>
}

export class UpdateDocumentRepository implements IUpdateDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateDocumentOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
