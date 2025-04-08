import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteOwnerOutput {
  deleted_count: number
}
export interface IDeleteOwnerRepository {
  handle(_id: string): Promise<IDeleteOwnerOutput>
  hasRelationship(_id: string): Promise<boolean>
}

export class DeleteOwnerRepository implements IDeleteOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteOwnerOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }

  async hasRelationship(_id: string): Promise<boolean> {
    const response = await this.database.collection('documents').aggregate([{ $match: { 'owner._id': _id } }])
    if (response.data.length > 0) {
      return true
    }

    return false
  }
}
