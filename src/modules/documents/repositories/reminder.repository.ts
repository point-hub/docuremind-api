import type { IDatabase, IPagination, IPipeline } from '@point-hub/papi'

import { collectionName } from '../entity'
import type { IRetrieveDocumentOutput } from './retrieve.repository'

export interface IReminderOutput {
  data: IRetrieveDocumentOutput[]
  pagination: IPagination
}
export interface IReminderRepository {
  handle(): Promise<IReminderOutput>
}

export class ReminderRepository implements IReminderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(): Promise<IReminderOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      data: response.data as unknown as IRetrieveDocumentOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters() {
    const filtersAnd = []
    filtersAnd.push({ status: 'borrowed' })

    const filterMatch = []
    if (filtersAnd.length) {
      filterMatch.push({ $match: { $and: filtersAnd } })
    }
    const date = new Date()
    date.setDate(date.getDate() + 7)

    const result = date.toISOString().split('T')[0]

    console.log(result)

    filterMatch.push({
      $addFields: {
        borrows: {
          $filter: {
            input: '$borrows',
            as: 'borrow',
            cond: { $eq: ['$$borrow.return_due_date', result] },
          },
        },
      },
    })
    filterMatch.push({
      $unwind: '$borrows',
    })
    filterMatch.push({
      $addFields: {
        borrow: '$borrows',
      },
    })
    filterMatch.push({
      $project: {
        borrows: 0, // Remove the original 'borrows' field
      },
    })
    filterMatch.push({
      $sort: {
        'borrow.required_date': -1,
      },
    })

    if (!filtersAnd.length) {
      return []
    }
    return filterMatch
  }
}
