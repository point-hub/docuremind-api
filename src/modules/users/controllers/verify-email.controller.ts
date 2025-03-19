import { objClean } from '@point-hub/express-utils'
import { type IController, type IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { RetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import { VerifyEmailRepository } from '../repositories/verify-email.repository'
import { VerifyEmailUseCase } from '../use-cases/verify-email.use-case'

export const verifyEmailController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const verifyEmailRepository = new VerifyEmailRepository(controllerInput.dbConnection, { session })
    const retrieveAllUserRepository = new RetrieveAllUserRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await VerifyEmailUseCase.handle(controllerInput.httpRequest['body'], {
      verifyEmailRepository,
      retrieveAllUserRepository,
      cleanObject: objClean,
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
