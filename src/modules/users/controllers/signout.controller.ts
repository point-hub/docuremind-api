import { type IController, type IControllerInput } from '@point-hub/papi'

export const signoutController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    // 3. handle business rules
    await session.commitTransaction()
    // 4. return response to client
    const cookies = [
      {
        name: 'POINTHUB_ACCESS',
        options: {
          secure: true,
          httpOnly: true,
          signed: true,
          expires: new Date(),
        },
      },
    ]

    return {
      status: 200,
      cookies: cookies,
      json: {},
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
