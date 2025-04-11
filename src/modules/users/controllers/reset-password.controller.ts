import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { ResetPasswordRepository } from '../repositories/reset-password.repository'
import { RetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import { ResetPasswordUseCase } from '../use-cases/reset-password.use-case'

export const resetPasswordController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const resetPasswordRepository = new ResetPasswordRepository(controllerInput.dbConnection, { session })
    const retrieveAllUserRepository = new RetrieveAllUserRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await ResetPasswordUseCase.handle(
      {
        _id: controllerInput.httpRequest['params'].id,
        data: controllerInput.httpRequest['body'],
      },
      {
        schemaValidation,
        retrieveAllUserRepository,
        resetPasswordRepository,
        hashPassword: Bun.password.hash,
        uniqueValidation,
        objClean,
      },
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
