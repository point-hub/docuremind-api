import type { ISchemaValidation } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'

import type { IRetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import type { IVerifyEmailRepository } from '../repositories/verify-email.repository'
import { verifyEmailValidation } from '../validations/verify-email.validation'

export interface IInput {
  code: string
}
export interface IDeps {
  verifyEmailRepository: IVerifyEmailRepository
  retrieveAllUserRepository: IRetrieveAllUserRepository
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
}
export interface IOutput {
  email: string
  matched_count: number
  modified_count: number
}

export class VerifyEmailUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, verifyEmailValidation)
    // 2. database operation
    const userResponse = await deps.retrieveAllUserRepository.handle({
      filter: {
        email_verification_code: input.code,
      },
    })
    // err.2.1
    if (userResponse.data.length === 0) {
      throwApiError(400, { message: 'Verification code is invalid' })
    }
    const response = await deps.verifyEmailRepository.handle(userResponse.data[0]._id)
    // 3. return response
    return {
      email: userResponse.data[0].email,
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
