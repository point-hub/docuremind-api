import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyOwnerOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyOwnerRepository {
  handle(documents: IDocument[]): Promise<ICreateManyOwnerOutput>
}

export class CreateManyOwnerRepository implements ICreateManyOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyOwnerOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
