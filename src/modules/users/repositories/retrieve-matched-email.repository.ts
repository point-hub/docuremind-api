import type { IDatabase, IPagination } from '@point-hub/papi'

import { collectionName } from '../entity'
import { type IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveMatchedEmailRepository {
  handle(trimmed_email: string): Promise<IRetrieveMatchedEmailOutput>
}

export interface IRetrieveMatchedEmailOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}

export class RetrieveMatchedEmailRepository implements IRetrieveMatchedEmailRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(trimmed_email: string): Promise<IRetrieveMatchedEmailOutput> {
    const response = await this.database.collection(collectionName).retrieveAll(
      {
        filter: {
          trimmed_email: {
            $regex: `^${trimmed_email}$`,
            $options: 'i',
          },
        },
      },
      this.options,
    )

    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
