import cors from '@koa/cors'
import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from '@koa/bodyparser'
import mount from 'koa-mount'
import { createHandler } from 'graphql-http/lib/use/koa'

import Http from './Http'
import NotFoundError from 'infra/errors/NotFoundError'
import SchemaError from 'infra/errors/SchemaError'

export default class KoaAdapter implements Http {
  private app: Koa
  private router: Router

  constructor() {
    this.app = new Koa()
    this.router = new Router()
    this.router.use(bodyParser())
    this.app.use(cors())
    this.app.use(this.router.routes())
  }

  rest(
    method: 'get' | 'post' | 'put',
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

  graphql(schema: any) {
    this.app.use(
      mount(
        '/graphql',
        createHandler({
          schema,
        }),
      ),
    )
  }

  listen(port: number): void {
    this.app.listen(port)
    console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`)
  }
}
