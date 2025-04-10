import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IReturnRejectDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IReturnRejectDocumentRepository {
  handle(_id: string): Promise<IReturnRejectDocumentOutput>
}

export class ReturnRejectDocumentRepository implements IReturnRejectDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IReturnRejectDocumentOutput> {
    return await this.database
      .collection(collectionName)
      .updateMany({ 'borrows._id': _id }, { $set: { 'borrows.$.status': 'approved' } }, { ...this.options })
  }
}
