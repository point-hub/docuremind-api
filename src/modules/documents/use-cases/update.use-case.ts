import { tokenGenerate } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { type IAuth } from '@/modules/users/interface'
import type { UniqueValidation } from '@/utils/unique-validation'
import { uploadFile } from '@/utils/upload'

import { DocumentEntity } from '../entity'
import type { IUpdateDocumentRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
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
    notes: string
    issued_date: string
    expired_date: string
    updated_by: {
      _id: string
      label: string
      email: string
    }
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
  schemaValidation: ISchemaValidation
  updateDocumentRepository: IUpdateDocumentRepository
  uniqueValidation: UniqueValidation
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateDocumentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
    input.data = JSON.parse(JSON.stringify(input.data))
    // 1. validate schema
    await deps.uniqueValidation.handle('documents', { code: { $regex: input.data.code, $options: 'i' } }, input._id)
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const mimeTypesMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
    }

    const documentEntity = new DocumentEntity({
      code: input.data.code,
      name: input.data.name,
      type: input.data.type,
      owner: input.data.owner,
      vault: input.data.vault,
      rack: input.data.rack,
      notes: input.data.notes,
      issued_date: input.data.issued_date,
      expired_date: input.data.expired_date,
      updated_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      updated_at: new Date(),
    })

    const coverFile = input.files.find((f) => f.fieldname === 'cover')
    if (coverFile) {
      const coverMimeType = coverFile.mimetype
      const cover = `cover-${tokenGenerate()}.${mimeTypesMap[coverFile.mimetype as unknown as keyof typeof mimeTypesMap]}`
      documentEntity.data.cover = cover
      documentEntity.data.cover_mime = coverMimeType
      await uploadFile(`${cover}`, coverFile.buffer)
    }

    const documentFile = input.files.find((f) => f.fieldname === 'document')
    if (documentFile) {
      const documentMimeType = documentFile.mimetype
      const document = `document-${tokenGenerate()}.${mimeTypesMap[documentFile.mimetype as unknown as keyof typeof mimeTypesMap]}`
      documentEntity.data.document = document
      documentEntity.data.document_mime = documentMimeType
      await uploadFile(`${document}`, documentFile.buffer)
    }
    // 3. database operation
    const response = await deps.updateDocumentRepository.handle(input._id, documentEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
