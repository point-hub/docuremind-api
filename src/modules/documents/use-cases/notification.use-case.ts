import type { IPagination } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { IRenderHbsTemplate, ISendMail } from '@/utils/email'

import type { IReminderRepository } from '../repositories/reminder.repository'
import type { IRetrieveDocumentOutput } from '../repositories/retrieve.repository'

export interface IInput {
  auth: IAuth
  _id: string
}

export interface IDeps {
  reminderRepository: IReminderRepository
  sendEmail: ISendMail
  renderHbsTemplate: IRenderHbsTemplate
}

export interface IOutput {
  data: IRetrieveDocumentOutput[]
  pagination: IPagination
}

export class NotificationUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    // 2. define entity
    // 3. database operation
    const response = await deps.reminderRepository.handle()
    console.log(response)
    // 5. send welcome email
    for (const data of response.data) {
      const compiledTemplate = await deps.renderHbsTemplate('modules/documents/emails/reminder.hbs', {
        owner: data.borrow.requested_by.label,
        document: `[${data.code}] ${data.name}`,
        due: data.borrow.return_due_date,
      })
      deps.sendEmail(compiledTemplate, data.borrow.requested_by.email, 'Reminder: Your Document Return is Almost Due')
    }
    // 4. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
