import type { ISchemaValidation } from '@point-hub/papi'

import { type IRenderHbsTemplate, type ISendMail, renderHbsTemplate, sendMail } from '@/utils/email'
import { type IThrowApiError } from '@/utils/throw-api-error'

import { UserEntity } from '../entity'
import type { IRetrieveMatchedEmailRepository } from '../repositories/retrieve-matched-email.repository'
import type { IGenerateResetPassword } from '../utils/generate-reset-password-link'
import { requestPasswordValidation } from '../validations/request-password.validation'

export interface IInput {
  pointhubSecret: string
  email: string
}

export interface IDeps {
  retrieveMatchedEmailRepository: IRetrieveMatchedEmailRepository
  generateResetPassword: IGenerateResetPassword
  schemaValidation: ISchemaValidation
  throwApiError: IThrowApiError
  sendEmail: ISendMail
  renderHbsTemplate: IRenderHbsTemplate
}

export class RequestPasswordUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<void> {
    // 1. validate schema
    await deps.schemaValidation({ email: input.email }, requestPasswordValidation)
    // 2. check any matched username / email in database
    const userEntity = new UserEntity({ email: input.email })
    userEntity.trimmedEmail()

    const users = await deps.retrieveMatchedEmailRepository.handle(userEntity.data.trimmed_email as string)
    // err.1. return error username is invalid

    if (users.data.length === 0) {
      deps.throwApiError(422, {
        errors: {
          email: ['Email is invalid'],
        },
      })
    }

    // 4. generate access token
    const link = await deps.generateResetPassword.handle({ _id: users.data[0]._id })
    // 5. send welcome email
    const compiledTemplate = await renderHbsTemplate('modules/users/emails/request-password.hbs', {
      name: users.data[0].name,
      link: link,
    })
    await sendMail(compiledTemplate, userEntity.data.email as string, 'Request reset password')
  }
}
