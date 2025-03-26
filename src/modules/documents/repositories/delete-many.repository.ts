import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyDocumentOutput {
  deleted_count: number
}
export interface IDeleteManyDocumentRepository {
  handle(_ids: string[]): Promise<IDeleteManyDocumentOutput>
}

export class DeleteManyDocumentRepository implements IDeleteManyDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyDocumentOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
