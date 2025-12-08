import { type IRetrieveActivityRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveActivityRepository: IRetrieveActivityRepository
}

export interface IOutput {
  _id: string
  name: string
  created_at: Date
  updated_at: Date
}

export class RetrieveActivityUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveActivityRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }
}
