import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import { VaultEntity } from '../entity'
import type { IRetrieveVaultRepository } from '../repositories/retrieve.repository'
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
  retrieveVaultRepository: IRetrieveVaultRepository
  createActivityRepository: ICreateActivityRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateVaultUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.uniqueValidation.handle('vaults', { code: { $regex: input.data.code, $options: 'i' } }, input._id)
    await deps.uniqueValidation.handle('vaults', { name: { $regex: input.data.name, $options: 'i' } }, input._id)
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
    const vault = await deps.retrieveVaultRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `update vault "${vault.name}" to "${input.data.name}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.updateVaultRepository.handle(input._id, vaultEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
