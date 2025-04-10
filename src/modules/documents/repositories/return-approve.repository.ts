import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IReturnApproveDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IReturnApproveDocumentRepository {
  handle(_id: string): Promise<IReturnApproveDocumentOutput>
}

export class ReturnApproveDocumentRepository implements IReturnApproveDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IReturnApproveDocumentOutput> {
    return await this.database
      .collection(collectionName)
      .updateMany(
        { 'borrows._id': _id },
        { $set: { 'borrows.$.status': 'returned', status: 'available' } },
        { ...this.options },
      )
  }
}
