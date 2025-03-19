import type { IObjClean } from '@point-hub/express-utils'
import type { IDocument, ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import type { IUpdateManyUserRepository } from '../repositories/update-many.repository'
import { updateManyValidation } from '../validations/update-many.validation'

export interface IInput {
  filter: IDocument
  data: {
    name?: string
    phone?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateManyUserRepository: IUpdateManyUserRepository
  objClean: IObjClean
}

export interface IOptions {
  session?: unknown
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateManyUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateManyValidation)
    // 2. define entity
    const userEntity = new UserEntity({
      name: input.data.name,
      phone: input.data.phone,
    })
    userEntity.generateDate('updated_at')
    userEntity.data = deps.objClean(userEntity.data)
    // 3. database operation
    const response = await deps.updateManyUserRepository.handle(input.filter, userEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
