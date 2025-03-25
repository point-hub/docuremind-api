import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import type { IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveAllUserOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}
export interface IRetrieveAllUserRepository {
  handle(query: IQuery): Promise<IRetrieveAllUserOutput>
}

export class RetrieveAllUserRepository implements IRetrieveAllUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllUserOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.['search']) {
      const filtersOr = []
      filtersOr.push({ name: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ username: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ email: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersOr.push({ role: { $regex: query.filter?.['search'], $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.['name']) filtersAnd.push({ name: { $regex: query.filter?.['name'], $options: 'i' } })
    if (query.filter?.['username']) filtersAnd.push({ username: { $regex: query.filter?.['username'], $options: 'i' } })
    if (query.filter?.['email']) filtersAnd.push({ email: { $regex: query.filter?.['email'], $options: 'i' } })
    if (query.filter?.['role']) filtersAnd.push({ role: { $regex: query.filter?.['role'], $options: 'i' } })
    if (query.filter?.['email_verification_code'])
      filtersAnd.push({ email_verification_code: { $eq: query.filter?.['email_verification_code'] } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
