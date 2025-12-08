import type { IActivityEntity } from './interface'

export type TypeFieldDate = 'created_at' | 'updated_at'

export const collectionName = 'activities'

export class ActivityEntity {
  constructor(public data: IActivityEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
