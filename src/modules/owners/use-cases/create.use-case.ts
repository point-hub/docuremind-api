import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IAuth } from '@/modules/users/interface'
import type { IUniqueValidation } from '@/utils/unique-validation'

import { OwnerEntity } from '../entity'
import type { ICreateOwnerRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    name: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  uniqueValidation: IUniqueValidation
  createOwnerRepository: ICreateOwnerRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateOwnerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.uniqueValidation.handle('owners', { name: input.data.name })
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const ownerEntity = new OwnerEntity({
      name: input.data.name,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_at: new Date(),
    })
    ownerEntity.data = deps.objClean(ownerEntity.data)
    // 3. database operation
    const response = await deps.createOwnerRepository.handle(ownerEntity.data)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
