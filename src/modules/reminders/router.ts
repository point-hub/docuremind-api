import { Router } from 'express'
import { type IBaseAppInput } from '@/app'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()
  console.log(routerInput.dbConnection)
  // Add routes here
  return router
}

export default makeRouter
