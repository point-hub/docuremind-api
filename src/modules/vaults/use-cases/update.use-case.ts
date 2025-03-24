import type { ISchemaValidation } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import { VaultEntity } from '../entity'
import type { IUpdateVaultRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
    racks?: { code?: string; name?: string }[]
    updated_by: {
      _id: string
      label: string
      email: string
    }
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateVaultRepository: IUpdateVaultRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateVaultUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.uniqueValidation.handle('vaults', { name: input.data.code }, input._id)
    await deps.uniqueValidation.handle('vaults', { name: input.data.name }, input._id)
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const vaultEntity = new VaultEntity({
      code: input.data.code,
      name: input.data.name,
      racks: input.data.racks,
      updated_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      updated_at: new Date(),
    })
    // 3. database operation
    const response = await deps.updateVaultRepository.handle(input._id, vaultEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
