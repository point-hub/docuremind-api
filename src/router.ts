import express, { type Express } from 'express'

import type { IBaseAppInput } from './app'
import userRouter from './modules/users/router'
import authRouter from './modules/users/router-auth'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/auth', await authRouter(baseRouterInput))

  return app
}
