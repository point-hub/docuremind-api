import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'
import QueryString from 'qs'

import { collectionName } from '../entity'
import type { IRetrieveDocumentOutput } from './retrieve.repository'

export interface IRetrieveAllDocumentOutput {
  data: IRetrieveDocumentOutput[]
  pagination: IPagination
}
export interface IRetrieveAllDocumentRepository {
  handle(query: IQuery): Promise<IRetrieveAllDocumentOutput>
}

export class RetrieveAllDocumentRepository implements IRetrieveAllDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllDocumentOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveDocumentOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = QueryString.parse(query as any)

    if (query.filter?.['search']) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ 'owner.label': { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ 'vault.label': { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ rack: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ expired_date: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.['code']) filtersAnd.push({ code: { $regex: query.filter?.['code'], $options: 'i' } })
    if (query.filter?.['name']) filtersAnd.push({ name: { $regex: query.filter?.['name'], $options: 'i' } })
    if (query.filter?.['owner']) filtersAnd.push({ 'owner.label': { $regex: query.filter?.['owner'], $options: 'i' } })
    if (query.filter?.['vault']) filtersAnd.push({ 'vault.label': { $regex: query.filter?.['vault'], $options: 'i' } })
    if (query.filter?.['rack']) filtersAnd.push({ 'rack.label': { $regex: query.filter?.['rack'], $options: 'i' } })

    if (query.filter?.['expired']) {
      // Get the current date and calculate the date 7 days later
      const today = new Date()
      const sevenDaysLater = new Date(today)
      sevenDaysLater.setDate(today.getDate() + 7)

      filtersAnd.push({
        $and: [
          {
            expired_date: {
              $ne: '',
            },
          },
          { expired_date: { $lte: `${sevenDaysLater.toISOString()}` } },
        ],
      })
    }
    if (query.filter?.['is_expired'] === 'expired') {
      const today = new Date()
      filtersAnd.push({
        $and: [
          {
            expired_date: {
              $ne: '',
            },
          },
          {
            expired_date: {
              $lte: today.toISOString(),
            },
          },
        ],
      })
    }

    if (query.filter?.['is_expired'] === 'expired_7_days') {
      // Get the current date and calculate the date 7 days later
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set time to midnight
      const sevenDaysLater = new Date(today)
      sevenDaysLater.setDate(today.getDate() + 7)
      filtersAnd.push({ expired_date: { $ne: '' } })
      filtersAnd.push({ expired_date: { $exists: true } })
      filtersAnd.push({ expired_date: { $gte: today.toISOString() } })
      filtersAnd.push({ expired_date: { $lte: sevenDaysLater.toISOString() } })
    }

    if (query.filter?.['status'] && query.filter?.['status'] !== 'all') {
      filtersAnd.push({ status: query.filter?.['status'] })
    }

    // console.log(query.filter?.['borrow_approval'])
    if (query.filter?.['borrow_approval']) {
      console.log('borrow_approval')
      filtersAnd.push({ 'borrows.status': 'pending' })
      return [
        { $match: { $and: filtersAnd } },
        {
          $addFields: {
            borrows: {
              $filter: {
                input: '$borrows',
                as: 'borrow',
                cond: {
                  $in: ['$$borrow.status', ['pending']],
                },
              },
            },
          },
        },
        {
          $unwind: '$borrows',
        },
        {
          $addFields: {
            borrow: '$borrows',
          },
        },
        {
          $project: {
            borrows: 0, // Remove the original 'borrows' field
          },
        },
        {
          $sort: {
            'borrow.required_date': 1,
          },
        },
      ]
    }

    if (query.filter?.['return_approval']) {
      filtersAnd.push({ 'borrows.status': 'returning' })
      return [
        { $match: { $and: filtersAnd } },
        {
          $addFields: {
            borrows: {
              $filter: {
                input: '$borrows',
                as: 'borrow',
                cond: {
                  $in: ['$$borrow.status', ['returning']],
                },
              },
            },
          },
        },
        {
          $unwind: '$borrows',
        },
        {
          $addFields: {
            borrow: '$borrows',
          },
        },
        {
          $project: {
            borrows: 0, // Remove the original 'borrows' field
          },
        },
        {
          $sort: {
            'borrow.required_date': 1,
          },
        },
      ]
    }

    if (query.filter?.['borrow_history']) {
      const filterMatch = []

      if (filtersAnd.length) {
        filterMatch.push({ $match: { $and: filtersAnd } })
      }
      filterMatch.push({
        $addFields: {
          borrows: {
            $filter: {
              input: '$borrows',
              as: 'borrow',
              cond: { $eq: ['$$borrow.requested_by._id', query.filter?.['requested_by']] },
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
      return filterMatch
    }

    if (!filtersAnd.length) {
      return []
    }
    return [{ $match: { $and: filtersAnd } }]
  }
}
