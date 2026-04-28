import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'

import { OwnerEntity } from '../entity'
import type { IRetrieveOwnerRepository } from '../repositories/retrieve.repository'
import type { IUpdateOwnerRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    name?: string
    updated_by: {
      _id: string
      label: string
      email: string
    }
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateOwnerRepository: IUpdateOwnerRepository
  retrieveOwnerRepository: IRetrieveOwnerRepository
  createActivityRepository: ICreateActivityRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateOwnerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.uniqueValidation.handle('owners', { name: { $regex: input.data.name, $options: 'i' } }, input._id)
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const ownerEntity = new OwnerEntity({
      name: input.data.name,
      updated_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      updated_at: new Date(),
    })
    // 3. database operation
    const owner = await deps.retrieveOwnerRepository.handle(input._id)
    await deps.createActivityRepository.handle({
      notes: `updated owner ${owner.name}`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.updateOwnerRepository.handle(input._id, ownerEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
