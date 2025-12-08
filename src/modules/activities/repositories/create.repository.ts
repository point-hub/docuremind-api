import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateActivityOutput {
  inserted_id: string
}
export interface ICreateActivityRepository {
  handle(document: IDocument): Promise<ICreateActivityOutput>
}

export class CreateActivityRepository implements ICreateActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateActivityOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
