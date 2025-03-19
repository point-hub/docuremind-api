import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import pointhubConfig from '@/config/pointhub'
import { renderHbsTemplate, sendMail } from '@/utils/email'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveMatchedEmailRepository } from '../repositories/retrieve-matched-email.repository'
import { RequestPasswordUseCase } from '../use-cases/request-password.use-case'
import { generateVerificationLink } from '../utils/generate-verification-link'

export const requestPasswordController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveMatchedEmailRepository = new RetrieveMatchedEmailRepository(controllerInput.dbConnection, { session })

    // 3. handle business rules
    await RequestPasswordUseCase.handle(
      {
        // pointhubSecret: pointhubConfig.secret,
        email: controllerInput.httpRequest['body']['email'],
      },
      {
        retrieveMatchedEmailRepository,
        throwApiError,
        schemaValidation,
        renderHbsTemplate,
        sendEmail: sendMail,
      },
    )

    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {},
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
