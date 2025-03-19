import type { IRetrieveExampleRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveExampleRepository: IRetrieveExampleRepository
}

export interface IOutput {
  _id: string
  name: string
  phone: string
  created_at: string
  updated_at: string
}

export class RetrieveExampleUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveExampleRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      phone: response.phone,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }
}
