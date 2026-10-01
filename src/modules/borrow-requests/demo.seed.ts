import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] borrow-requests demo data`, dbConnection, options)
  // Add demo data here if needed
}
