import { Router } from 'express'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createOwnerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllOwnerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveOwnerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updateOwnerController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deleteOwnerController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
