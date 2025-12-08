import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'
import QueryString from 'qs'

import { collectionName } from '../entity'
import type { IRetrieveActivityOutput } from './retrieve.repository'

export interface IRetrieveAllActivityOutput {
  data: IRetrieveActivityOutput[]
  pagination: IPagination
}
export interface IRetrieveAllActivityRepository {
  handle(query: IQuery): Promise<IRetrieveAllActivityOutput>
}

export class RetrieveAllActivityRepository implements IRetrieveAllActivityRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllActivityOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveActivityOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = QueryString.parse(query as any)

    if (query.filter?.['search']) {
      const filtersOr = []
      filtersOr.push({ notes: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.['user_id']) filtersAnd.push({ 'user._id': query.filter?.['user_id'] })
    if (query.filter?.['notes']) filtersAnd.push({ notes: { $regex: query.filter?.['notes'], $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
