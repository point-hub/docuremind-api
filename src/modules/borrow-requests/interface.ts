export interface IBorrowRequestEntity {
  _id?: string
  document_id: string
  borrower_id: string
  borrow_date?: Date
  return_due_date: Date
  return_date?: Date
  required_date: Date
  status: 'pending' | 'approved' | 'rejected' | 'overdue'
  created_at?: Date
  updated_at?: Date
}
