import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'
import { type JwtPayload } from 'jsonwebtoken'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'
import { throwApiError } from '@/utils/throw-api-error'

import type { IRetrieveUserRepository } from '../repositories/retrieve.repository'
import { verifyTokenValidation } from '../validations/verify-token.validation'

export interface IInput {
  project_id: string
  token: string
  secret: string
}

export interface IDeps {
  retrieveAuthUserRepository: IRetrieveUserRepository
  throwApiError(codeStatus: TypeCodeStatus, options: IOptionsApiError): void
  schemaValidation: ISchemaValidation
  verifyToken(token: string, secret: string): string | JwtPayload
}

export interface IOutput {
  _id: string
  email: string
  username: string
  name: string
}

export class VerifyTokenUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, verifyTokenValidation)
    // 2. verify token
    const decodedToken = deps.verifyToken(input.token, input.secret)
    if (!decodedToken) {
      // err 2.1 unverified token
      throwApiError(403)
    }
    // 3. database operation
    const authUser = await deps.retrieveAuthUserRepository.handle(decodedToken.sub as string)
    console.log(authUser)
    // 4. return response
    return {
      _id: authUser._id as string,
      username: authUser.username as string,
      email: authUser.email as string,
      name: authUser.name as string,
    }
  }
}
