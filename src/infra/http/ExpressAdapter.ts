import express, { Application, Request, Response } from 'express'

import Http from './Http'
import NotFoundError from 'infra/errors/NotFoundError'
import SchemaError from 'infra/errors/SchemaError'

export default class ExpressAdapter implements Http {
  private app: Application

  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  on(
    method: 'get' | 'post',
    url: string,
    callback: (
      params: Record<string, string>,
      body: Record<string, any>,
    ) => Promise<{ status: number; body: any }>,
  ): void {
    this.app[method](url, async (request: Request, response: Response) => {
      try {
        const result = await callback(request.params, request.body)
        response.status(result.status).json(result.body)
      } catch (error) {
        if (error instanceof NotFoundError) {
          response.status(error.status).json({ message: error.message })
        } else if (error instanceof SchemaError) {
          response
            .status(error.status)
            .json({ code: error.code, field: error.field })
        } else if (error instanceof Error) {
          response.status(400).json({ message: error.message })
        } else {
          response.status(500).json({ message: 'Internal server error' })
        }
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port)
    console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`)
  }
}
