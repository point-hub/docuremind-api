import type { IAuthLookup } from '@/modules/users/interface'
import { getFile } from '@/utils/upload'

import { type IRetrieveDocumentRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveDocumentRepository: IRetrieveDocumentRepository
}

interface IOption {
  _id: string
  label: string
}

export interface IOutput {
  _id: string
  cover: string
  cover_mime: string
  cover_url: string
  document_files: { name: string; mime: string; url: string }[]
  code: string
  name: string
  type: string
  owner: IOption
  vault: IOption
  rack: IOption
  notes: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  borrows: any
  status: string
  issued_date: string
  expired_date: string
  created_at: Date
  created_by: IAuthLookup
  updated_at: Date
  updated_by: IAuthLookup
  requested_at?: Date
  requested_by?: IAuthLookup
  reason_for_borrowing?: string
  required_date?: string
  return_due_date?: string
}

export class RetrieveDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveDocumentRepository.handle(input._id)
    // 2. output
    const documentFiles = []
    if (response.document_files) {
      for (const documentFile of response.document_files) {
        documentFiles.push({
          name: documentFile.document,
          mime: documentFile.document_mime,
          url: (await getFile(documentFile.document)) as string,
        })
      }
    }
    return {
      _id: response._id,
      cover: response.cover,
      cover_mime: response.cover_mime,
      cover_url: (await getFile(response.cover)) as string,
      document_files: documentFiles,
      code: response.code,
      name: response.name,
      type: response.type,
      owner: response.owner,
      vault: response.vault,
      rack: response.rack,
      notes: response.notes ?? '',
      borrows: response.borrows,
      status: response.status,
      issued_date: response.issued_date,
      expired_date: response.expired_date,
      created_at: response.created_at,
      created_by: response.created_by,
      updated_at: response.updated_at,
      updated_by: response.updated_by,
      requested_at: response.requested_at,
      requested_by: response.requested_by,
      reason_for_borrowing: response.reason_for_borrowing,
      required_date: response.required_date,
      return_due_date: response.return_due_date,
    }
  }
}
