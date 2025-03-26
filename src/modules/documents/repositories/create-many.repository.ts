import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyDocumentOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyDocumentRepository {
  handle(documents: IDocument[]): Promise<ICreateManyDocumentOutput>
}

export class CreateManyDocumentRepository implements ICreateManyDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyDocumentOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
