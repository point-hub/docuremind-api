import { Router } from 'express'

import { type IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput) => {
  const router = Router()

  router.post(
    '/signup',
    await makeController({
      controller: controller.signupController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/signin',
    await makeController({
      controller: controller.signinController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/verify-email',
    await makeController({
      controller: controller.verifyEmailController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/verify-token',
    await makeController({
      controller: controller.verifyTokenController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/request-password',
    await makeController({
      controller: controller.requestPasswordController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/reset-password',
    await makeController({
      controller: controller.resetPasswordController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/is-email-exists',
    await makeController({
      controller: controller.isEmailExistsController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
