import type { ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import type { IIsEmailExistsRepository } from '../repositories/is-email-exists.repository'
import { isEmailExistsValidation } from '../validations/is-email-exists.validation'

export interface IInput {
  email: string
}
export interface IDeps {
  isEmailExistsRepository: IIsEmailExistsRepository
  schemaValidation: ISchemaValidation
}
export interface IOutput {
  exists: boolean
}

export class IsEmailExistsUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. define entity
    const userEntity = new UserEntity({ email: input.email })
    userEntity.trimmedEmail()
    // 2. validate schema
    await deps.schemaValidation(userEntity.data, isEmailExistsValidation)
    // 3. database operation
    const response = await deps.isEmailExistsRepository.handle({
      filter: { trimmed_email: userEntity.data.trimmed_email },
    })
    // 4. return is email exists or not
    return {
      exists: response,
    }
  }
}
