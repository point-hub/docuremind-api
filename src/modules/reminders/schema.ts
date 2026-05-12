import type { ISchema } from '@point-hub/papi'
import { collectionName } from './entity'

export const schema: ISchema[] = [
  {
    collection: collectionName,
    unique: [[]],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['borrow_id', 'user_id', 'send_date', 'status'],
      properties: {
        borrow_id: {
          bsonType: 'string',
          description: 'The ID of the borrow request this reminder is for',
        },
        user_id: {
          bsonType: 'string',
          description: 'The ID of the user receiving the reminder',
        },
        send_date: {
          bsonType: 'date',
          description: 'The date and time the reminder was/should be sent',
        },
        status: {
          enum: ['sent', 'failed'],
          description: 'The status of the reminder',
        },
      },
    },
  },
]
