import type { IDatabase, IDocument } from '@point-hub/papi'
import { collectionName } from '../entity'

export interface ICreateReminderOutput {
  inserted_id: string
}

export interface ICreateReminderRepository {
  handle(document: IDocument): Promise<ICreateReminderOutput>
}

export class CreateReminderRepository implements ICreateReminderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateReminderOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
