import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'

import Http from './Http'
import NotFoundError from 'infra/errors/NotFoundError'
import SchemaError from 'infra/errors/SchemaError'

export default class KoaAdapter implements Http {
  private app: Koa
  private router: Router

  constructor() {
    this.app = new Koa()
    this.router = new Router()
    this.app.use(bodyparser())
    this.app.use(this.router.routes())
  }

  on(
    method: 'get' | 'post',
    url: string,
    callback: (
      params: unknown,
      body: unknown,
    ) => Promise<{ status: number; body: any }>,
  ): void {
    this.router[method](url, async (context: any) => {
      try {
        const result = await callback(
          context.request.params,
          context.request.body,
        )
        context.status = result.status
        context.body = result.body
      } catch (error) {
        if (error instanceof NotFoundError) {
          context.status = error.status
          context.body = { message: error.message }
        } else if (error instanceof SchemaError) {
          context.status = error.status
          context.body = {
            code: error.code,
            field: error.field,
          }
        } else if (error instanceof Error) {
          context.status = 400
          context.body = { message: error.message }
        } else {
          context.status = 500
          context.body = { message: 'Internal server error' }
        }
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port)
    console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`)
  }
}
