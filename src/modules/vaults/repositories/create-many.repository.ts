import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyVaultOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyVaultRepository {
  handle(documents: IDocument[]): Promise<ICreateManyVaultOutput>
}

export class CreateManyVaultRepository implements ICreateManyVaultRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyVaultOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
