import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyUserRepository {
  handle(documents: IDocument[]): Promise<ICreateManyUserOutput>
}

export interface ICreateManyUserOutput {
  inserted_ids: string[]
  inserted_count: number
}

export class CreateManyUserRepository implements ICreateManyUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyUserOutput> {
    return await this.database
      .collection(collectionName)
      .createMany(documents, { ignoreUndefined: true, ...this.options })
  }
}
