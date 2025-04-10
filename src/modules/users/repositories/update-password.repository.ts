import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdatePasswordUserRepository {
  handle(_id: string, document: IDocument): Promise<IUpdatePasswordUserOutput>
}

export interface IUpdatePasswordUserOutput {
  matched_count: number
  modified_count: number
}

export class UpdatePasswordUserRepository implements IUpdatePasswordUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdatePasswordUserOutput> {
    console.log(document)
    return await this.database
      .collection(collectionName)
      .update(_id, { $set: document }, { ignoreUndefined: true, ...this.options })
  }
}
