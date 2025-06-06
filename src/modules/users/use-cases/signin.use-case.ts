import type { ISchemaValidation } from '@point-hub/papi'

import type { IThrowApiError } from '@/utils/throw-api-error'

import { UserEntity } from '../entity'
import type { IRetrieveMatchedUsernameRepository } from '../repositories/retrieve-matched-username.repository'
import { signinValidation } from '../validations/signin.validation'

export interface IInput {
  username: string
  password: string
}
export interface IDeps {
  retrieveMatchedUsernameRepository: IRetrieveMatchedUsernameRepository
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  verifyPassword(password: string, hash: string): Promise<boolean>
  throwApiError: IThrowApiError
  generateAccessToken(_id: string): string
  generateRefreshToken(_id: string): string
}
export interface IOptions {
  session?: unknown
}
interface IOutput {
  email: string
  username: string
  name: string
  tokens: {
    token_type: string
    access_token: string
    refresh_token: string
  }
}

export class SigninUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    console.log(1)
    await deps.schemaValidation({ username: input.username, password: input.password }, signinValidation)
    // 2. check any matched username / email in database
    console.log(2)
    const userInput = new UserEntity({ username: input.username, email: input.username })
    userInput.trimmedUsername()
    userInput.trimmedEmail()
    console.log(3, userInput.data)
    const users = await deps.retrieveMatchedUsernameRepository.handle(
      userInput.data.trimmed_username ?? '',
      userInput.data.trimmed_email ?? '',
    )
    console.log(4, users)
    // err.1. return error username is invalid
    if (users.data.length === 0) {
      deps.throwApiError(401)
    }
    // 3. validate password
    console.log(2, users.data[0])
    const user = new UserEntity(users.data[0])
    const isPasswordVerified = await deps.verifyPassword(input.password, user.data.password as string)
    // err.2. return error password is invalid
    if (!isPasswordVerified) {
      deps.throwApiError(401)
    }
    // err.3. email is not verified
    if (!user.data.is_email_verified) {
      deps.throwApiError(422, {
        errors: {
          username: ['email is not verified'],
        },
      })
    }
    console.log(31, user)
    // 4. generate access token
    console.log(4)
    const accessToken = deps.generateAccessToken(user.data._id as string)
    const refreshToken = deps.generateRefreshToken(user.data._id as string)
    // 5 setup auth cookies
    console.log(5)
    const date = new Date()
    date.setDate(date.getDate() + 60)
    const cookies = [
      {
        name: 'POINTHUB_ACCESS',
        val: accessToken,
        options: {
          secure: true,
          httpOnly: true,
          signed: true,
          expires: date,
        },
      },
    ]
    // 6. return data
    return {
      _id: user.data._id as string,
      email: user.data.email as string,
      username: user.data.username as string,
      name: user.data.name as string,
      cookies: cookies,
      tokens: {
        token_type: 'Bearer',
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    }
  }
}
