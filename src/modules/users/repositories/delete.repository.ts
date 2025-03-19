import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteUserRepository {
  handle(_id: string): Promise<IDeleteUserOutput>
}

export interface IDeleteUserOutput {
  deleted_count: number
}

export class DeleteUserRepository implements IDeleteUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteUserOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
