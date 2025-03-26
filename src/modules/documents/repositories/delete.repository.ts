import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteDocumentOutput {
  deleted_count: number
}
export interface IDeleteDocumentRepository {
  handle(_id: string): Promise<IDeleteDocumentOutput>
}

export class DeleteDocumentRepository implements IDeleteDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteDocumentOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
