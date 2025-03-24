import { type IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveUserRepository } from '@/modules/users/repositories/retrieve.repository'
import { VerifyTokenUseCase } from '@/modules/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

export const verifyUserToken = async (controllerInput: IControllerInput, options?: Record<string, unknown>) => {
  const retrieveAuthUserRepository = new RetrieveUserRepository(controllerInput.dbConnection, options)

  return await VerifyTokenUseCase.handle(
    {
      token: controllerInput.httpRequest['signedCookies'].POINTHUB_ACCESS,
      secret: authConfig.secret,
      project_id: controllerInput.httpRequest['query'].project_id,
    },
    {
      schemaValidation,
      throwApiError,
      retrieveAuthUserRepository,
      verifyToken,
    },
  )
}
