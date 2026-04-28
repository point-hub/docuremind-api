import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] reminders data`)
  // delete all data inside collection
  await dbConnection.collection('reminders').deleteAll(options)
}
