import type { IDatabase, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IIsEmailExistsRepository {
  handle(query: IQuery): Promise<TypeEmailExistsOutput>
}

export type TypeEmailExistsOutput = boolean

export class IsEmailExistsRepository implements IIsEmailExistsRepository {
  public collection = collectionName

  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<TypeEmailExistsOutput> {
    const response = await this.database.collection(this.collection).retrieveAll(query, this.options)
    return response.pagination.total_document > 0
  }
}
