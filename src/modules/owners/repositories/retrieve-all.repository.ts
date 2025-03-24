import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import type { IRetrieveOwnerOutput } from './retrieve.repository'

export interface IRetrieveAllOwnerOutput {
  data: IRetrieveOwnerOutput[]
  pagination: IPagination
}
export interface IRetrieveAllOwnerRepository {
  handle(query: IQuery): Promise<IRetrieveAllOwnerOutput>
}

export class RetrieveAllOwnerRepository implements IRetrieveAllOwnerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllOwnerOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveOwnerOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.['search']) {
      const filtersOr = []
      filtersOr.push({ name: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.['name']) filtersAnd.push({ name: { $regex: query.filter?.['name'], $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
