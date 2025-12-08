import type { IController, IControllerInput } from '@point-hub/papi'

import { CreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { schemaValidation } from '@/utils/validation'

import type { IAuth } from '../interface'
import { DeleteUserRepository } from '../repositories/delete.repository'
import { RetrieveUserRepository } from '../repositories/retrieve.repository'
import { DeleteUserUseCase } from '../use-cases/delete.use-case'
import { verifyUserToken } from '../utils/verify-user-token'

export const deleteUserController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteUserRepository = new DeleteUserRepository(controllerInput.dbConnection, { session })
    const retrieveUserRepository = new RetrieveUserRepository(controllerInput.dbConnection, { session })
    const createActivityRepository = new CreateActivityRepository(controllerInput.dbConnection, { session })
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3. handle business logic
    const response = await DeleteUserUseCase.handle(
      { _id: controllerInput.httpRequest['params'].id, auth: verifyTokenResponse as IAuth },
      { schemaValidation, retrieveUserRepository, deleteUserRepository, createActivityRepository },
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
