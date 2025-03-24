import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/users/utils/verify-user-token'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { DeleteVaultRepository } from '../repositories/delete.repository'
import { DeleteVaultUseCase } from '../use-cases/delete.use-case'

export const deleteVaultController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteVaultRepository = new DeleteVaultRepository(controllerInput.dbConnection, { session })
    // 3. handle business logic
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 delete
    const response = await DeleteVaultUseCase.handle(
      { _id: controllerInput.httpRequest['params'].id, reason: controllerInput.httpRequest['body'].reason },
      { schemaValidation, deleteVaultRepository, throwApiError },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: { deleted_count: response.deleted_count },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
