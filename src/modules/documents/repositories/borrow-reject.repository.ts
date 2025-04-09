import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IBorrowRejectDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IBorrowRejectDocumentRepository {
  handle(_id: string): Promise<IBorrowRejectDocumentOutput>
}

export class BorrowRejectDocumentRepository implements IBorrowRejectDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IBorrowRejectDocumentOutput> {
    return await this.database
      .collection(collectionName)
      .updateMany({ 'borrows._id': _id }, { $set: { 'borrows.$.status': 'rejected' } }, { ...this.options })
  }
}
