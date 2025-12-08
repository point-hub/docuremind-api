import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllUserUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllUserController: IController = async (controllerInput: IControllerInput) => {
  console.log(controllerInput.httpRequest['query'])
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllUserRepository = new RetrieveAllUserRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveAllUserUseCase.handle(
      { query: controllerInput.httpRequest['query'] },
      { retrieveAllUserRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        data: response.data,
        pagination: response.pagination,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
