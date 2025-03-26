import type { IRetrieveVaultRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveVaultRepository: IRetrieveVaultRepository
}

export interface IOutput {
  _id: string
  code: string
  name: string
  racks: { code: string; name: string }[]
  created_at: Date
  updated_at: Date
}

export class RetrieveVaultUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveVaultRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      code: response.code,
      name: response.name,
      racks: response.racks,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }
}
