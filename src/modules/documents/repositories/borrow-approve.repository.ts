import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IBorrowApproveDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IBorrowApproveDocumentRepository {
  handle(_id: string): Promise<IBorrowApproveDocumentOutput>
}

export class BorrowApproveDocumentRepository implements IBorrowApproveDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IBorrowApproveDocumentOutput> {
    return await this.database
      .collection(collectionName)
      .updateMany(
        { 'borrows._id': _id },
        { $set: { 'borrows.$.status': 'approved', status: 'borrowed' } },
        { ...this.options },
      )
  }
}
