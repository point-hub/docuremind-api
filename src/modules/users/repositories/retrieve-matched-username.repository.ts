import type { IDatabase, IPagination } from '@point-hub/papi'

import { collectionName } from '../entity'
import { type IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveMatchedUsernameRepository {
  handle(trimmed_username: string, trimmed_email: string): Promise<IRetrieveMatchedUsernameOutput>
}

export interface IRetrieveMatchedUsernameOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}

export class RetrieveMatchedUsernameRepository implements IRetrieveMatchedUsernameRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(trimmed_username: string, trimmed_email: string): Promise<IRetrieveMatchedUsernameOutput> {
    const response = await this.database.collection(collectionName).retrieveAll(
      {
        filter: {
          $or: [
            {
              trimmed_username: {
                $regex: `^${trimmed_username}$`,
                $options: 'i',
              },
            },
            {
              trimmed_email: {
                $regex: `^${trimmed_email}$`,
                $options: 'i',
              },
            },
          ],
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
