import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IReturnDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IReturnDocumentRepository {
  handle(_id: string): Promise<IReturnDocumentOutput>
}

export class ReturnDocumentRepository implements IReturnDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IReturnDocumentOutput> {
    return await this.database
      .collection(collectionName)
      .updateMany({ 'borrows._id': _id }, { $set: { 'borrows.$.status': 'returning' } }, { ...this.options })
  }
}
