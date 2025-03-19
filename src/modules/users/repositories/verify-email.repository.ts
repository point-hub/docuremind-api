import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IVerifyEmailRepository {
  handle(_id: string): Promise<IVerifyEmailOutput>
}

export interface IVerifyEmailOutput {
  matched_count: number
  modified_count: number
}

export class VerifyEmailRepository implements IVerifyEmailRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IVerifyEmailOutput> {
    return await this.database.collection(collectionName).update(
      _id,
      {
        $set: {
          is_email_verified: true,
          email_verified_at: new Date(),
        },
        $unset: { email_verification_code: '' },
      },
      { ignoreUndefined: true, ...this.options },
    )
  }
}
