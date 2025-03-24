import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/users/utils/verify-user-token'

import { RetrieveOwnerRepository } from '../repositories/retrieve.repository'
import { RetrieveOwnerUseCase } from '../use-cases/retrieve.use-case'

export const retrieveOwnerController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveOwnerRepository = new RetrieveOwnerRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve
    const response = await RetrieveOwnerUseCase.handle(
      { _id: controllerInput.httpRequest['params'].id },
      { retrieveOwnerRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        label: response.label,
        code: response.code,
        name: response.name,
        address: response.address,
        phone: response.phone,
        notes: response.notes,
        created_at: response.created_at,
        updated_at: response.updated_at,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
