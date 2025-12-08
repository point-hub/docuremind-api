import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteActivityOutput {
  deleted_count: number
}
export interface IDeleteActivityRepository {
  handle(_id: string): Promise<IDeleteActivityOutput>
  hasRelationship(_id: string): Promise<boolean>
}

export class DeleteActivityRepository implements IDeleteActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteActivityOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }

  async hasRelationship(_id: string): Promise<boolean> {
    const response = await this.database.collection('documents').aggregate([{ $match: { 'activity._id': _id } }])
    if (response.data.length > 0) {
      return true
    }

    return false
  }
}
