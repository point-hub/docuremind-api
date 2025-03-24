import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateOwnerOutput {
  inserted_id: string
}
export interface ICreateOwnerRepository {
  handle(document: IDocument): Promise<ICreateOwnerOutput>
}

export class CreateOwnerRepository implements ICreateOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateOwnerOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
