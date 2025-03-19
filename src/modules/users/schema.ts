/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/current/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */

import type { ISchema } from '@point-hub/papi'

import { collectionName } from './entity'

export const schema: ISchema[] = [
  {
    collection: collectionName,
    unique: [['email'], ['trimmed_email']],
    uniqueIfExists: [['username'], ['trimmed_username']],
    schema: {
      bsonType: 'object',
      required: ['email'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'The name for the user',
        },
        username: {
          bsonType: 'string',
          description: 'The username for the user',
        },
        trimmed_username: {
          bsonType: 'string',
          description: 'Is a unique username by ignoring spaces',
        },
        email: {
          bsonType: 'string',
          description: 'The email for the user',
        },
        trimmed_email: {
          bsonType: 'string',
          description: 'Is a unique email by ignoring dot and +',
        },
        password: {
          bsonType: 'string',
          description: 'The password for the user',
        },
        email_verification_code: {
          bsonType: 'string',
          description: 'Code for verification email',
        },
        is_email_verified: {
          bsonType: 'boolean',
          description: 'Is email verified or not',
        },
      },
    },
  },
]
