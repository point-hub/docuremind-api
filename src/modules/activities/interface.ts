export interface IActivityEntity {
  _id?: string
  code?: string
  name?: string
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
  created_at?: Date
  updated_at?: Date
}
