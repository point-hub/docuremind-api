import type { IOwnerEntity } from './interface'

export type TypeFieldDate = 'created_at' | 'updated_at'

export const collectionName = 'owners'

export class OwnerEntity {
  constructor(public data: IOwnerEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
