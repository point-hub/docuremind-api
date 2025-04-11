import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import apiConfig from '@/config/api'
import { throwApiError } from '@/utils/throw-api-error'
import type { IUniqueValidation } from '@/utils/unique-validation'

import type { IResetPasswordRepository } from '../repositories/reset-password.repository'
import type { IRetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import { resetPasswordValidation } from '../validations/reset-password.validation'

export interface IInput {
  _id: string
  data: {
    code?: string
    password?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  resetPasswordRepository: IResetPasswordRepository
  retrieveAllUserRepository: IRetrieveAllUserRepository
  uniqueValidation: IUniqueValidation
  hashPassword(password: string): Promise<string>
  objClean: IObjClean
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ResetPasswordUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 2. validate schema

    await deps.schemaValidation(input.data, resetPasswordValidation)
    // 3. define entity
    const link = `${apiConfig.clientUrl}/reset-password/${input.data.code}`
    const user = await deps.retrieveAllUserRepository.handle({
      filter: {
        reset_password_link: link,
      },
    })
    // 4. database operation
    console.log(user.data[0])
    if (user.data.length === 0) {
      throwApiError(400, { message: 'Reset link is invalid' })
    }
    const response = await deps.resetPasswordRepository.handle(user.data[0]._id, {
      password: await deps.hashPassword(input.data.password as string),
    })
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
