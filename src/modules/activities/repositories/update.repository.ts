import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateActivityOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateActivityRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateActivityOutput>
}

export class UpdateActivityRepository implements IUpdateActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateActivityOutput> {
    await this.updateRelationship(_id, document)
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }

  private async updateRelationship(_id: string, document: IDocument): Promise<IUpdateActivityOutput> {
    return await this.database
      .collection('documents')
      .updateMany({ 'activity._id': _id }, { $set: { 'activity.label': document['name'] } }, this.options)
  }
}
