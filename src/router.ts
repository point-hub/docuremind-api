import express, { type Express, type Request, type Response } from 'express'

import type { IBaseAppInput } from './app'
import ownerRouter from './modules/owners/router'
import userRouter from './modules/users/router'
import authRouter from './modules/users/router-auth'
import vaultRouter from './modules/vaults/router'
import { renderHbsTemplate } from './utils/email'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/auth', await authRouter(baseRouterInput))
  app.use('/v1/owners', await ownerRouter(baseRouterInput))
  app.use('/v1/vaults', await vaultRouter(baseRouterInput))

  /**
   * Rendered email templates
   *
   * @example
   * Access this in your browser using the following path:
   * /templates/modules/examples/emails/example
   */
  app.get('/templates/*', async (req: Request, res: Response) => {
    const html = await renderHbsTemplate(`${req.params[0]}.hbs`)
    res.send(html)
  })

  return app
}
