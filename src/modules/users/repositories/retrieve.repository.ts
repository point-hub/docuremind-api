import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveUserRepository {
  handle(_id: string): Promise<IRetrieveUserOutput>
}

export interface IRetrieveUserOutput {
  _id: string
  name: string
  email: string
  email_verification_code: string
  is_email_verified: boolean
  created_at: string
  updated_at: string
}

export class RetrieveUserRepository implements IRetrieveUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveUserOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, this.options)

    return {
      _id: response._id,
      name: response['name'] as string,
      email: response['email'] as string,
      email_verification_code: response['email_verification_code'] as string,
      is_email_verified: response['is_email_verified'] as boolean,
      created_at: response['created_at'] as string,
      updated_at: response['updated_at'] as string,
    }
  }
}
