import { Router } from 'express'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllActivityController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
