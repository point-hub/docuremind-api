import { Router } from 'express'
import multer from 'multer'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }) // 50MB

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/',
    upload.any(),
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
    upload.any(),
    await makeController({
      controller: controller.updateDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/borrow',
    await makeController({
      controller: controller.borrowDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/borrow-approve/:borrowId',
    await makeController({
      controller: controller.borrowApproveDocumentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/borrow-reject/:borrowId',
    await makeController({
      controller: controller.borrowRejectDocumentController,
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
