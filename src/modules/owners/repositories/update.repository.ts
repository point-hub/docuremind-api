import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateOwnerOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateOwnerRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateOwnerOutput>
}

export class UpdateOwnerRepository implements IUpdateOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateOwnerOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
