import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { DeleteManyUserRepository } from '../repositories/delete-many.repository'
import { DeleteManyUserUseCase } from '../use-cases/delete-many.use-case'

export const deleteManyUserController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteManyUserRepository = new DeleteManyUserRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await DeleteManyUserUseCase.handle(
      { ids: controllerInput.httpRequest['body'].ids },
      { schemaValidation, deleteManyUserRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: { deleted_count: response.deleted_count },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
