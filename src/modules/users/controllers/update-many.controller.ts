import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { UpdateManyUserRepository } from '../repositories/update-many.repository'
import { UpdateManyUserUseCase } from '../use-cases/update-many.use-case'

export const updateManyUserController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updateManyUserRepository = new UpdateManyUserRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await UpdateManyUserUseCase.handle(
      {
        filter: controllerInput.httpRequest['body'].filter,
        data: controllerInput.httpRequest['body'].data,
      },
      { updateManyUserRepository, schemaValidation, objClean },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        matched_count: response.matched_count,
        modified_count: response.modified_count,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
