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
  code: string
  name: string
  type: string
  owner: IOption
  vault: IOption
  rack: string
  notes: string
  status: string
  issued_date: string
  expired_date: string
  created_at: Date
  updated_at: Date
}

export class RetrieveDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveDocumentRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      code: response.code,
      name: response.name,
      type: response.type,
      owner: response.owner,
      vault: response.vault,
      rack: response.rack,
      notes: response.notes ?? '',
      status: response.status,
      issued_date: response.issued_date,
      expired_date: response.expired_date,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }
}
