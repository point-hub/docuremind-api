import { type IObjClean, tokenGenerate } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { ICreateActivityRepository } from '@/modules/activities/repositories/create.repository'
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
    rack: {
      _id: string
      label: string
    }
    issued_date: string
    due_date_reminder: string
    expired_date: string
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
  createActivityRepository: ICreateActivityRepository
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
    await deps.uniqueValidation.handle('documents', { code: { $regex: input.data.code, $options: 'i' } })
    await deps.schemaValidation(input.data, createValidation)
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
      status: 'available',
      issued_date: input.data.issued_date,
      due_date_reminder: input.data.due_date_reminder,
      expired_date: input.data.expired_date,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_at: new Date(),
    })
    const coverFile = input.files.find((f) => f.fieldname === 'cover')
    if (coverFile) {
      const coverMimeType = coverFile.mimetype
      const cover = `cover-${tokenGenerate()}.${mimeTypesMap[coverFile.mimetype as unknown as keyof typeof mimeTypesMap]}`
      documentEntity.data.cover = cover
      documentEntity.data.cover_mime = coverMimeType
      await uploadFile(`${cover}`, coverFile.buffer)
    }

    const documentFiles = input.files.filter((f) => f.fieldname === 'document_files[]')
    documentEntity.data.document_files = []
    if (documentFiles && documentFiles.length > 0) {
      for (const documentFile of documentFiles) {
        const documentMimeType = documentFile.mimetype
        const document = `document-${tokenGenerate()}.${mimeTypesMap[documentFile.mimetype as unknown as keyof typeof mimeTypesMap]}`
        documentEntity.data.document_files.push({
          document: document,
          document_mime: documentMimeType,
        })

        await uploadFile(`${document}`, documentFile.buffer)
      }
    }
    documentEntity.data = deps.objClean(documentEntity.data)
    console.log('h')
    // 3. database operation
    await deps.createActivityRepository.handle({
      notes: `created document "${input.data.name}"`,
      user: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      date: new Date(),
    })
    const response = await deps.createDocumentRepository.handle(documentEntity.data)
    console.log('i')
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
