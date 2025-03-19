import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveExampleRepository {
  handle(_id: string): Promise<IRetrieveExampleOutput>
}

export interface IRetrieveExampleOutput {
  _id: string
  name: string
  phone: string
  created_at: string
  updated_at: string
}

export class RetrieveExampleRepository implements IRetrieveExampleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveExampleOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, this.options)
    return {
      _id: response._id,
      name: response['name'] as string,
      phone: response['phone'] as string,
      created_at: response['created_at'] as string,
      updated_at: response['updated_at'] as string,
    }
  }
}
