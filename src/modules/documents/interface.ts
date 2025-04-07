export interface IDocumentEntity {
  _id?: string
  cover?: string
  code?: string
  name?: string
  type?: string
  issued_date?: Date
  expired_date?: Date
  owner?: {
    _id?: string
    label?: string
  }
  vault?: {
    _id?: string
    label?: string
  }
  rack?: string
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
}
