import type { IController, IControllerInput } from '@point-hub/papi'

import type { IAuth } from '@/modules/users/interface'
import { verifyUserToken } from '@/modules/users/utils/verify-user-token'
import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { BorrowDocumentRepository } from '../repositories/borrow.repository'
import { BorrowDocumentUseCase } from '../use-cases/borrow.use-case'

export const borrowDocumentController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection, { session })
    const borrowDocumentRepository = new BorrowDocumentRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 borrow
    const response = await BorrowDocumentUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest['params'].id,
        data: controllerInput.httpRequest['body'],
      },
      { schemaValidation, borrowDocumentRepository, uniqueValidation },
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
