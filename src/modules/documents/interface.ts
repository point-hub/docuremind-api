export interface IDocumentEntity {
  _id?: string
  cover?: string
  cover_mime?: string
  document_files?: {
    document?: string
    document_mime?: string
  }[]
  code?: string
  name?: string
  type?: string
  issued_date?: string
  due_date_reminder?: string
  expired_date?: string
  owner?: {
    _id?: string
    label?: string
  }
  vault?: {
    _id?: string
    label?: string
  }
  rack?: {
    _id?: string
    label?: string
  }
  created_by?: {
    _id?: string
    label?: string
    email?: string
  }
  updated_by?: {
    _id?: string
    label?: string
    email?: string
  }
  notes?: string
  status?: string
  created_at?: Date
  updated_at?: Date
  // Borrow
  requested_by?: {
    _id?: string
    label?: string
    email?: string
  }
  reason_for_borrowing?: string
  required_date?: string
  return_due_date?: string
  requested_at?: Date
}
