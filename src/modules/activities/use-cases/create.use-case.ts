import type { IAuth } from '@/modules/users/interface'

import type { ICreateActivityRepository } from '../repositories/create.repository'

export interface IInput {
  auth: IAuth
  data: {
    notes?: string
  }
}

export interface IDeps {
  createActivityRepository: ICreateActivityRepository
}

export interface IOutput {
  inserted_id: string
}

export class CreateActivityUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 3. database operation
    const response = await deps.createActivityRepository.handle({
      notes: input.data.notes,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
