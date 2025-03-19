import pkg from 'jsonwebtoken'

import authConfig from '@/config/auth'

export interface IDecodedToken {
  _id: string
  username: string
  name: string
  email: string
}

const { sign, verify } = pkg

export const tokenType = 'Bearer'

export const getTokenFromHeader = (authorization: string) => {
  if (authorization && authorization.split(' ')[0] === tokenType) {
    return authorization.split(' ')[1]
  }
}

export const generateAccessToken = (id: string) => {
  const date = new Date().getTime()
  // expired in 24 hour
  const exp = new Date().setTime(date + 1000 * 60 * 60 * 24)
  return sign(
    {
      iss: authConfig.issuer,
      sub: id,
      iat: date,
      exp: exp,
    },
    authConfig.secret,
  )
}

export const generateRefreshToken = (id: string) => {
  const date = new Date().getTime()
  // expired in 1 month
  const exp = new Date().setTime(date + 1000 * 60 * 60 * 24 * 30)
  return sign(
    {
      iss: authConfig.issuer,
      sub: id,
      iat: date,
      exp: exp,
    },
    authConfig.secret,
  )
}

export const verifyToken = (token: string, secret: string) => {
  return verify(token, secret)
}

export const isExpired = (exp: number) => {
  if (new Date().getTime() < exp) {
    return false
  }

  return true
}
