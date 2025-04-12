import type { IController, IControllerInput } from '@point-hub/papi'

import type { IAuth } from '@/modules/users/interface'
import { verifyUserToken } from '@/modules/users/utils/verify-user-token'
import { renderHbsTemplate, sendMail } from '@/utils/email'

import { ReminderRepository } from '../repositories/reminder.repository'
import { ReminderUseCase } from '../use-cases/reminder.use-case'

export const reminderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const reminderRepository = new ReminderRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 reminder
    const response = await ReminderUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest['params'].id,
      },
      { reminderRepository, renderHbsTemplate: renderHbsTemplate, sendEmail: sendMail },
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
