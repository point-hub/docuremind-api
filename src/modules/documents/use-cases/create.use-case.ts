import { type IObjClean, tokenGenerate } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IAuth } from '@/modules/users/interface'
import type { IUniqueValidation } from '@/utils/unique-validation'
import { uploadFile } from '@/utils/upload'

import { DocumentEntity } from '../entity'
import type { ICreateDocumentRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code: string
    name: string
    type: string
    owner: {
      _id: string
      label: string
    }
    vault: {
      _id: string
      label: string
    }
    rack: string
    issued_date: Date
    expired_date: Date
    notes?: string
  }
  files: {
    fieldname: string
    originalname: string
    mimetype: string
    buffer: Buffer
    size: number
  }[]
}

export interface IDeps {
  objClean: IObjClean
  uniqueValidation: IUniqueValidation
  createDocumentRepository: ICreateDocumentRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
    input.data = JSON.parse(JSON.stringify(input.data))
    // 1. validate schema
    await deps.uniqueValidation.handle('documents', { name: input.data.name })
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const mimeTypesMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
    }

    const cover = `cover-${tokenGenerate()}.${mimeTypesMap[input.files[0].mimetype as unknown as keyof typeof mimeTypesMap]}`
    await uploadFile(`${cover}`, input.files[0].buffer)
    const documentEntity = new DocumentEntity({
      cover: cover,
      code: input.data.code,
      name: input.data.name,
      type: input.data.type,
      owner: input.data.owner,
      vault: input.data.vault,
      rack: input.data.rack,
      notes: input.data.notes,
      status: 'available',
      issued_date: input.data.issued_date,
      expired_date: input.data.expired_date,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_at: new Date(),
    })
    documentEntity.data = deps.objClean(documentEntity.data)
    // 3. database operation
    const response = await deps.createDocumentRepository.handle(documentEntity.data)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
