import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
import { type IRenderHbsTemplate, type ISendMail } from '@/utils/email'
import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, UserEntity } from '../entity'
import type { IAuth } from '../interface'
import type { ICreateUserRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  name?: string
  username?: string
  email?: string
  password?: string
  role?: string
}

export interface IDeps {
  createUserRepository: ICreateUserRepository
  schemaValidation: ISchemaValidation
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
  sendEmail: ISendMail
  hashPassword(password: string): Promise<string>
  renderHbsTemplate: IRenderHbsTemplate
  generateVerificationLink(): string
  generateVerificationCode(): string
  createActivityRepository: ICreateActivityRepository
}

export interface IOutput {
  inserted_id: string
}

export class CreateUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate unique
    await deps.uniqueValidation.handle(collectionName, { name: input.name })
    // 2. validate schema
    await deps.schemaValidation(input, createValidation)
    // 3. define entity
    const linkVerification = deps.generateVerificationLink()
    const codeVerification = deps.generateVerificationCode()
    const userEntity = new UserEntity({
      name: input.name,
      username: input.username,
      email: input.email,
      password: input.password ? await deps.hashPassword(input.password) : '',
      role: input.role,
      created_at: new Date(),
      email_verification_code: codeVerification,
    })
    userEntity.trimmedEmail()
    userEntity.trimmedUsername()
    // 4. database operation
    await deps.createActivityRepository.handle({
      notes: `invited "${input.name}" with role "${input.role}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.createUserRepository.handle(userEntity.data)
    // 5. send welcome email
    const compiledTemplate = await deps.renderHbsTemplate('modules/users/emails/email-verification.hbs', {
      linkVerification: linkVerification,
      codeVerification: codeVerification,
    })
    deps.sendEmail(compiledTemplate, userEntity.data.email as string, 'Please verify your email address')
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
