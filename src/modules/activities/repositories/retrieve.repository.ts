import type { IDatabase, IPipeline } from '@point-hub/papi'

import { type IAuthLookup } from '@/modules/users/interface'

import { collectionName } from '../entity'

export interface IRetrieveActivityOutput {
  _id: string
  name: string
  created_by: IAuthLookup
  updated_by: IAuthLookup
  created_at: Date
  updated_at: Date
}
export interface IRetrieveActivityRepository {
  handle(_id: string): Promise<IRetrieveActivityOutput>
}

export class RetrieveActivityRepository implements IRetrieveActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveActivityOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]['_id']}`,
      name: `${response.data[0]['name']}`,
      created_by: response.data[0]['created_by'] as IAuthLookup,
      updated_by: response.data[0]['updated_by'] as IAuthLookup,
      created_at: response.data[0]['created_at'] as Date,
      updated_at: response.data[0]['updated_at'] as Date,
    }
  }

  private aggregateJoinCreatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'created_by',
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateJoinUpdatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'updated_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'updated_by',
        },
      },
      {
        $unwind: {
          path: '$updated_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
