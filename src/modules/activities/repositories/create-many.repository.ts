import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyActivityOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyActivityRepository {
  handle(documents: IDocument[]): Promise<ICreateManyActivityOutput>
}

export class CreateManyActivityRepository implements ICreateManyActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyActivityOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
