import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateDocumentOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateDocumentRepository {
  handle(
    _id: string,
    document: IDocument,
    files: Record<string, unknown>,
    keep_files: string[],
  ): Promise<IUpdateDocumentOutput>
}

export class UpdateDocumentRepository implements IUpdateDocumentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(
    _id: string,
    document: IDocument,
    files: Record<string, unknown>,
    keep_files: string[],
  ): Promise<IUpdateDocumentOutput> {
    await this.database.collection(collectionName).update(
      _id,
      {
        $pull: {
          document_files: {
            document: { $nin: keep_files },
          },
        },
      },
      { ...this.options, ignoreUndefined: true },
    )
    return await this.database.collection(collectionName).update(
      _id,
      {
        $set: document,
        $push: {
          document_files: { $each: files },
        },
      },
      { ...this.options, ignoreUndefined: true },
    )
  }
}
