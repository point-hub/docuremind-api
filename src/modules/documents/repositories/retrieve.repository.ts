import type { IDatabase, IPipeline } from '@point-hub/papi'

import { type IAuthLookup } from '@/modules/users/interface'

import { collectionName } from '../entity'

interface IOption {
  _id: string
  label: string
}

export interface IRetrieveDocumentOutput {
  _id: string
  cover: string
  code: string
  name: string
  type: string
  owner: IOption
  vault: IOption
  rack: string
  status: string
  notes: string
  created_by: IAuthLookup
  updated_by: IAuthLookup
  created_at: Date
  updated_at: Date
  issued_date: string
  expired_date: string
}
export interface IRetrieveDocumentRepository {
  handle(_id: string): Promise<IRetrieveDocumentOutput>
}

export class RetrieveDocumentRepository implements IRetrieveDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveDocumentOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]['_id']}`,
      cover: `${response.data[0]['cover']}`,
      code: `${response.data[0]['code']}`,
      name: `${response.data[0]['name']}`,
      type: `${response.data[0]['type']}`,
      owner: response.data[0]['owner'] as IOption,
      vault: response.data[0]['vault'] as IOption,
      rack: `${response.data[0]['rack']}`,
      notes: response.data[0]['notes'] as string,
      status: `${response.data[0]['status']}`,
      created_by: response.data[0]['created_by'] as IAuthLookup,
      updated_by: response.data[0]['updated_by'] as IAuthLookup,
      created_at: response.data[0]['created_at'] as Date,
      updated_at: response.data[0]['updated_at'] as Date,
      issued_date: response.data[0]['issued_date'] as string,
      expired_date: response.data[0]['expired_date'] as string,
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
