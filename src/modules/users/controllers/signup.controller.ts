import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import pointhubConfig from '@/config/pointhub'
import { renderHbsTemplate, sendMail } from '@/utils/email'
import { schemaValidation } from '@/utils/validation'

import { RetrieveUserRepository } from '../repositories/retrieve.repository'
import { SignupRepository } from '../repositories/signup.repository'
import { SignupUseCase } from '../use-cases/signup.use-case'
import { generateVerificationLink } from '../utils/generate-verification-link'

export const signupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const signupRepository = new SignupRepository(controllerInput.dbConnection, { session })
    const retrieveRepository = new RetrieveUserRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const responseCreate = await SignupUseCase.handle(
      {
        pointhubSecret: pointhubConfig.secret,
        data: controllerInput.httpRequest['body'],
      },
      {
        signupRepository,
        retrieveRepository,
        cleanObject: objClean,
        schemaValidation,
        hashPassword: Bun.password.hash,
        renderHbsTemplate: renderHbsTemplate,
        sendEmail: sendMail,
        generateVerificationCode: tokenGenerate,
        generateVerificationLink: generateVerificationLink,
      },
    )

    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: responseCreate.inserted_id,
        user_info: {
          name: responseCreate.user_info.name,
          username: responseCreate.user_info.username,
          email: responseCreate.user_info.email,
        },
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
