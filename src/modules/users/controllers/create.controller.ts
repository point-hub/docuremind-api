import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { CreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { renderHbsTemplate, sendMail } from '@/utils/email'
import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import type { IAuth } from '../interface'
import { CreateUserRepository } from '../repositories/create.repository'
import { CreateUserUseCase } from '../use-cases/create.use-case'
import { generateVerificationLink } from '../utils/generate-verification-link'
import { verifyUserToken } from '../utils/verify-user-token'

export const createUserController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createUserRepository = new CreateUserRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection, { session })
    const createActivityRepository = new CreateActivityRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    const response = await CreateUserUseCase.handle(
      { ...controllerInput.httpRequest['body'], auth: verifyTokenResponse as IAuth },
      {
        createUserRepository,
        hashPassword: Bun.password.hash,
        schemaValidation,
        uniqueValidation,
        objClean,
        renderHbsTemplate: renderHbsTemplate,
        sendEmail: sendMail,
        generateVerificationCode: tokenGenerate,
        generateVerificationLink: generateVerificationLink,
        createActivityRepository,
      },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
