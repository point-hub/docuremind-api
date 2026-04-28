import type { IReminderEntity } from './interface'

export type TypeFieldDate = 'created_at' | 'updated_at' | 'send_date'

export const collectionName = 'reminders'

export class ReminderEntity {
  constructor(public data: IReminderEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
