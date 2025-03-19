import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateUserRepository {
  handle(document: IDocument): Promise<ICreateUserOutput>
}

export interface ICreateUserOutput {
  inserted_id: string
}

export class CreateUserRepository implements ICreateUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateUserOutput> {
    return await this.database
      .collection(collectionName)
      .create({ ...document, created_at: new Date() }, { ignoreUndefined: true, ...this.options })
  }
}
