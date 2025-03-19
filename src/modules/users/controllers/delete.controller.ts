import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { DeleteUserRepository } from '../repositories/delete.repository'
import { DeleteUserUseCase } from '../use-cases/delete.use-case'

export const deleteUserController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteUserRepository = new DeleteUserRepository(controllerInput.dbConnection, { session })
    // 3. handle business logic
    const response = await DeleteUserUseCase.handle(
      { _id: controllerInput.httpRequest['params'].id },
      { schemaValidation, deleteUserRepository },
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
