import { BaseConsoleCommand, BaseDatabaseConnection, BaseMongoDBConnection } from '@point-hub/papi'

import mongoDBConfig from '@/config/mongodb'
import { renderHbsTemplate, sendMail } from '@/utils/email'

export default class NotificationCommand extends BaseConsoleCommand {
  dbConnection = new BaseDatabaseConnection(new BaseMongoDBConnection(mongoDBConfig.url, mongoDBConfig.name))

  constructor() {
    super({
      name: 'notification',
      description: 'Populate database with default entries',
      summary: 'Populate database with default entries',
      arguments: [],
      options: [],
    })
  }
  async handle(): Promise<void> {
    let session
    try {
      await this.dbConnection.open()
      session = this.dbConnection.startSession()
      session.startTransaction()
      const todayString = new Date().toISOString().substring(0, 10)
      const response = await this.dbConnection.collection('documents').retrieveAll({
        filter: {
          due_date_reminder: {
            $eq: '2025-11-11',
          },
        },
      })
      // for (const element of response.data) {
      //   const compiledTemplate = await renderHbsTemplate('modules/documents/emails/notification.hbs', {
      //     owner: element.owner.label,
      //     document: element.code,
      //     due: element.expired_date,
      //   })
      //   const response2 = await this.dbConnection.collection('users').retrieveAll({
      //     filter: {
      //       role: {
      //         $eq: 'admin',
      //       },
      //     },
      //   })
      //   for (const element2 of response2.data) {
      //     if (element2.role === 'admin' && !element2.email.includes('@example.com')) {
      //       console.log(element2.email)
      //       await sendMail(compiledTemplate, element2.email, 'Pengingat Perpanjangan Dokumen ' + element.code)
      //     }
      //   }
      // }
      console.log(response)
    } catch (error) {
      console.error(error)
      await session?.abortTransaction()
    } finally {
      await session?.commitTransaction()
      await session?.endSession()
      this.dbConnection.close()
    }
  }
}
