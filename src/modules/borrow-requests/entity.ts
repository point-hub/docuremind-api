import type { IBorrowRequestEntity } from './interface'

export type TypeFieldDate = 'created_at' | 'updated_at' | 'borrow_date' | 'return_date'

export const collectionName = 'borrow-requests'

export class BorrowRequestEntity {
  constructor(public data: IBorrowRequestEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
