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
  cover_mime: string
  document: string
  document_mime: string
  code: string
  name: string
  type: string
  owner: IOption
  vault: IOption
  rack: IOption
  status: string
  notes: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  borrows: any[]
  created_by: IAuthLookup
  updated_by: IAuthLookup
  created_at: Date
  updated_at: Date
  issued_date: string
  expired_date: string
  // Borrow
  requested_at?: Date
  requested_by?: IAuthLookup
  reason_for_borrowing?: string
  required_date?: string
  return_due_date?: string
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

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]['_id']}`,
      cover: `${response.data[0]['cover']}`,
      cover_mime: `${response.data[0]['cover_mime']}`,
      document: `${response.data[0]['document']}`,
      document_mime: `${response.data[0]['document_mime']}`,
      code: `${response.data[0]['code']}`,
      name: `${response.data[0]['name']}`,
      type: `${response.data[0]['type']}`,
      owner: response.data[0]['owner'] as IOption,
      vault: response.data[0]['vault'] as IOption,
      rack: response.data[0]['rack'] as IOption,
      notes: response.data[0]['notes'] as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      borrows: response.data[0]['borrows'] as unknown as any,
      status: `${response.data[0]['status']}`,
      created_by: response.data[0]['created_by'] as IAuthLookup,
      created_at: response.data[0]['created_at'] as Date,
      updated_by: response.data[0]['updated_by'] as IAuthLookup,
      updated_at: response.data[0]['updated_at'] as Date,
      issued_date: response.data[0]['issued_date'] as string,
      expired_date: response.data[0]['expired_date'] as string,
      requested_by: response.data[0]['requested_by'] as IAuthLookup,
      requested_at: response.data[0]['requested_at'] as Date,
      required_date: response.data[0]['required_date'] as string,
      return_due_date: response.data[0]['return_due_date'] as string,
      reason_for_borrowing: response.data[0]['reason_for_borrowing'] as string,
    }
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
