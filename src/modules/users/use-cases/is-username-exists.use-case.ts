import type { ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import type { IIsUsernameExistsRepository } from '../repositories/is-username-exists.repository'
import { isUsernameExistsValidation } from '../validations/is-username-exists.validation'

export interface IInput {
  username: string
}
export interface IDeps {
  isUsernameExistsRepository: IIsUsernameExistsRepository
  schemaValidation: ISchemaValidation
}
export interface IOutput {
  exists: boolean
}

export class IsUsernameExistsUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. define entity
    const userEntity = new UserEntity({ username: input.username })
    userEntity.trimmedUsername()
    // 2. validate schema
    await deps.schemaValidation(userEntity.data, isUsernameExistsValidation)
    // 3. database operation
    const response = await deps.isUsernameExistsRepository.handle({
      filter: { trimmed_username: userEntity.data.trimmed_username },
    })
    // 4. return is username exists or not
    return {
      exists: response,
    }
  }
}
