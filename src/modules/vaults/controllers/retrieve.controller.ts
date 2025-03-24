import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/users/utils/verify-user-token'

import { RetrieveVaultRepository } from '../repositories/retrieve.repository'
import { RetrieveVaultUseCase } from '../use-cases/retrieve.use-case'

export const retrieveVaultController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveVaultRepository = new RetrieveVaultRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve
    const response = await RetrieveVaultUseCase.handle(
      { _id: controllerInput.httpRequest['params'].id },
      { retrieveVaultRepository },
    )
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
