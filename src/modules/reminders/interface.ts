export interface IReminderEntity {
  _id?: string
  borrow_id: string
  user_id: string
  send_date: Date
  status: 'sent' | 'failed'
  created_at?: Date
  updated_at?: Date
}
