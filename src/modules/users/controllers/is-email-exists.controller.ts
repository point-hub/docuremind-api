import { type IController, type IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { IsEmailExistsRepository } from '../repositories/is-email-exists.repository'
import { IsEmailExistsUseCase } from '../use-cases/is-email-exists.use-case'

export const isEmailExistsController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const isEmailExistsRepository = new IsEmailExistsRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    const response = await IsEmailExistsUseCase.handle(controllerInput.httpRequest['body'], {
      isEmailExistsRepository,
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
