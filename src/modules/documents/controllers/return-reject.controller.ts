import type { IController, IControllerInput } from '@point-hub/papi'

import type { IAuth } from '@/modules/users/interface'
import { verifyUserToken } from '@/modules/users/utils/verify-user-token'
import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { RetrieveDocumentRepository } from '../repositories/retrieve.repository'
import { ReturnRejectDocumentRepository } from '../repositories/return-reject.repository'
import { ReturnRejectDocumentUseCase } from '../use-cases/return-reject.use-case'

export const returnRejectDocumentController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection, { session })
    const returnRejectDocumentRepository = new ReturnRejectDocumentRepository(controllerInput.dbConnection, {
      session,
    })
    const retrieveDocumentRepository = new RetrieveDocumentRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 return
    const response = await ReturnRejectDocumentUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest['params'].id,
        return_id: controllerInput.httpRequest['params'].returnId,
      },
      { schemaValidation, retrieveDocumentRepository, returnRejectDocumentRepository, uniqueValidation },
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
