import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IBorrowDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IBorrowDocumentRepository {
  handle(_id: string, document: IDocument): Promise<IBorrowDocumentOutput>
}

export class BorrowDocumentRepository implements IBorrowDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IBorrowDocumentOutput> {
    return await this.database
      .collection(collectionName)
      .update(_id, { $set: document }, { ...this.options, ignoreUndefined: true })
  }
}
