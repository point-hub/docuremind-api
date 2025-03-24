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
    // await this.database
    //   .collection(collectionName)
    //   .create({ ...document, created_at: new Date() }, { ignoreUndefined: true, ...this.options })

    return `${apiConfig.clientUrl}`
  }
}
