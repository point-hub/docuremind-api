import type { IDatabase, IDocument } from '@point-hub/papi'
import { collectionName } from '../entity'

export interface ICreateBorrowRequestOutput {
  inserted_id: string
}

export interface ICreateBorrowRequestRepository {
  handle(document: IDocument): Promise<ICreateBorrowRequestOutput>
}

export class CreateBorrowRequestRepository implements ICreateBorrowRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateBorrowRequestOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
