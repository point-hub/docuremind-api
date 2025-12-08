import type { IController, IControllerInput } from '@point-hub/papi'

import { CreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import type { IAuth } from '@/modules/users/interface'
import { verifyUserToken } from '@/modules/users/utils/verify-user-token'
import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { RetrieveDocumentRepository } from '../repositories/retrieve.repository'
import { ReturnDocumentRepository } from '../repositories/return.repository'
import { ReturnDocumentUseCase } from '../use-cases/return.use-case'

export const returnDocumentController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection, { session })
    const returnDocumentRepository = new ReturnDocumentRepository(controllerInput.dbConnection, { session })
    const retrieveDocumentRepository = new RetrieveDocumentRepository(controllerInput.dbConnection, { session })
    const createActivityRepository = new CreateActivityRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 return
    const response = await ReturnDocumentUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest['params'].id,
        document_id: controllerInput.httpRequest['body'].document_id,
      },
      {
        schemaValidation,
        retrieveDocumentRepository,
        createActivityRepository,
        returnDocumentRepository,
        uniqueValidation,
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
