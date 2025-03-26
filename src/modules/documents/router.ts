import { Router } from 'express'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updateDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deleteDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
