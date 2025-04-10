import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import type { IUpdatePasswordUserRepository } from '../repositories/update-password.repository'
import { updatePasswordValidation } from '../validations/update-password.validation'

export interface IInput {
  _id: string
  data: {
    password?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updatePasswordUserRepository: IUpdatePasswordUserRepository
  uniqueValidation: IUniqueValidation
  hashPassword(password: string): Promise<string>
  objClean: IObjClean
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdatePasswordUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 2. validate schema

    await deps.schemaValidation(input.data, updatePasswordValidation)
    // 3. define entity

    // 4. database operation
    const response = await deps.updatePasswordUserRepository.handle(input._id, {
      password: await deps.hashPassword(input.data.password as string),
    })
    // 5. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
