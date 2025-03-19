import type { IDatabase, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IIsUsernameExistsRepository {
  handle(query: IQuery): Promise<TypeUsernameExistsOutput>
}

export type TypeUsernameExistsOutput = boolean

export class IsUsernameExistsRepository implements IIsUsernameExistsRepository {
  public collection = collectionName

  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<TypeUsernameExistsOutput> {
    const response = await this.database.collection(this.collection).retrieveAll(query, this.options)
    return response.pagination.total_document > 0
  }
}
