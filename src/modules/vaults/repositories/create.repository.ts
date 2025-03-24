import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateVaultOutput {
  inserted_id: string
}
export interface ICreateVaultRepository {
  handle(document: IDocument): Promise<ICreateVaultOutput>
}

export class CreateVaultRepository implements ICreateVaultRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateVaultOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
