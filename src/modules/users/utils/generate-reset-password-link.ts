import { tokenGenerate } from '@point-hub/express-utils'

import apiConfig from '@/config/api'

export const generateLink = () => {
  const token = tokenGenerate()

  return `${apiConfig.clientUrl}/reset-password/${token}`
}

import type { IDatabase, IDocument } from '@point-hub/papi'

export interface IGenerateResetPassword {
  handle(document: IDocument): Promise<string>
}

export class GenerateResetPassword implements IGenerateResetPassword {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<string> {
    const link = generateLink()
    await this.database.collection('users').update(
      document['_id'],
      {
        $set: {
          reset_password_link: link,
        },
      },
      { ignoreUndefined: true, ...this.options },
    )

    return `${link}`
  }
}
