import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IAuth } from '@/modules/users/interface'
import type { IUniqueValidation } from '@/utils/unique-validation'

import { VaultEntity } from '../entity'
import type { ICreateVaultRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code: string
    name: string
    racks: {
      code: string
      name: string
    }[]
  }
}

export interface IDeps {
  objClean: IObjClean
  uniqueValidation: IUniqueValidation
  createVaultRepository: ICreateVaultRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateVaultUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.uniqueValidation.handle('vaults', { code: input.data.code })
    await deps.uniqueValidation.handle('vaults', { name: input.data.name })
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const vaultEntity = new VaultEntity({
      code: input.data.code,
      name: input.data.name,
      racks: input.data.racks,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_at: new Date(),
    })
    vaultEntity.data = deps.objClean(vaultEntity.data)
    // 3. database operation
    const response = await deps.createVaultRepository.handle(vaultEntity.data)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
