import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateUserRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateUserOutput>
}

export interface IUpdateUserOutput {
  matched_count: number
  modified_count: number
}

export class UpdateUserRepository implements IUpdateUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateUserOutput> {
    return await this.database
      .collection(collectionName)
      .update(_id, { $set: document }, { ignoreUndefined: true, ...this.options })
  }
}
