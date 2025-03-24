export interface IUserEntity {
  _id?: string
  name?: string
  role?: string
  username?: string
  trimmed_username?: string // for checking unique username by ignoring spaces
  email?: string
  trimmed_email?: string // for checking unique email by ignoring dot and +
  password?: string
  email_verification_code?: string
  is_email_verified?: boolean
  created_at?: Date
  updated_at?: Date
  email_verified_at?: Date
}

export interface IAuthLookup {
  lookup_from?: string
  _id?: string
  label?: string
  email?: string
}

export interface IAuth {
  _id?: string
  label?: string
  name?: string
  username?: string
  email?: string
}
