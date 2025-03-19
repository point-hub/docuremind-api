import { type IController, type IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { IsUsernameExistsRepository } from '../repositories/is-username-exists.repository'
import { IsUsernameExistsUseCase } from '../use-cases/is-username-exists.use-case'

export const isUsernameExistsController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const isUsernameExistsRepository = new IsUsernameExistsRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    const response = await IsUsernameExistsUseCase.handle(controllerInput.httpRequest['body'], {
      isUsernameExistsRepository,
      schemaValidation,
    })
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: response,
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
