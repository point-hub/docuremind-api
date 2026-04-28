import type { ISchema } from '@point-hub/papi'
import { collectionName } from './entity'

export const schema: ISchema[] = [
  {
    collection: collectionName,
    unique: [[]],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['document_id', 'borrower_id', 'return_due_date', 'required_date', 'status'],
      properties: {
        document_id: {
          bsonType: 'string',
          description: 'The ID of the document being borrowed',
        },
        borrower_id: {
          bsonType: 'string',
          description: 'The ID of the user borrowing the document',
        },
        borrow_date: {
          bsonType: 'date',
          description: 'The date the document was borrowed',
        },
        return_due_date: {
          bsonType: 'date',
          description: 'The expected date the document should be returned',
        },
        return_date: {
          bsonType: 'date',
          description: 'The actual date the document was returned',
        },
        required_date: {
          bsonType: 'date',
          description: 'The date the document is required by the borrower',
        },
        status: {
          enum: ['pending', 'approved', 'rejected', 'overdue'],
          description: 'The status of the borrow request',
        },
      },
    },
  },
]
