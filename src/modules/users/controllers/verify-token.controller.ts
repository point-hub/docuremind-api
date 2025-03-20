import { type IController, type IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveUserRepository } from '../repositories/retrieve.repository'
import { VerifyTokenUseCase } from '../use-cases/verify-token.use-case'
import { verifyToken } from '../utils/jwt'

export const verifyTokenController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveUserRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await VerifyTokenUseCase.handle(
      {
        token: controllerInput.httpRequest['signedCookies'].POINTHUB_ACCESS,
        secret: authConfig.secret,
        project_id: controllerInput.httpRequest['query'].project_id,
      },
      {
        schemaValidation,
        throwApiError,
        retrieveAuthUserRepository,
        verifyToken,
      },
    )
    await session.commitTransaction()
    // 4. return response to client
    const date = new Date()
    date.setDate(date.getDate() + 60)
    return {
      status: 200,
      json: {
        _id: response._id,
        email: response.email,
        username: response.username,
        name: response.name,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
