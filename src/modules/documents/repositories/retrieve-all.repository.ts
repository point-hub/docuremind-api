import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

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

    if (query.filter?.['name']) filtersAnd.push({ name: { $regex: query.filter?.['name'], $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
