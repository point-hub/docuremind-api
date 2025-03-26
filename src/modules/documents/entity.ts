import type { IDocumentEntity } from './interface'

export type TypeFieldDate = 'created_at' | 'updated_at'

export const collectionName = 'documents'

export class DocumentEntity {
  constructor(public data: IDocumentEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
