import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] owners data`)
  // delete all data inside collection
  await dbConnection.collection('owners').deleteAll(options)
}
