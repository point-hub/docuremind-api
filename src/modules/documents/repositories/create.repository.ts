import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateDocumentOutput {
  inserted_id: string
}
export interface ICreateDocumentRepository {
  handle(document: IDocument): Promise<ICreateDocumentOutput>
}

export class CreateDocumentRepository implements ICreateDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateDocumentOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
