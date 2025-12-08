import type { IController, IControllerInput } from '@point-hub/papi'

import { CreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import type { IAuth } from '@/modules/users/interface'
import { verifyUserToken } from '@/modules/users/utils/verify-user-token'
import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { RetrieveOwnerRepository } from '../repositories/retrieve.repository'
import { UpdateOwnerRepository } from '../repositories/update.repository'
import { UpdateOwnerUseCase } from '../use-cases/update.use-case'

export const updateOwnerController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection, { session })
    const updateOwnerRepository = new UpdateOwnerRepository(controllerInput.dbConnection, { session })
    const retrieveOwnerRepository = new RetrieveOwnerRepository(controllerInput.dbConnection, { session })
    const createActivityRepository = new CreateActivityRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 update
    const response = await UpdateOwnerUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest['params'].id,
        data: controllerInput.httpRequest['body'],
      },
      { schemaValidation, retrieveOwnerRepository, createActivityRepository, updateOwnerRepository, uniqueValidation },
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
