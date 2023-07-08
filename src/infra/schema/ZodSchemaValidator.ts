import { ZodError, ZodSchema, z } from 'zod'

import SchemaValidator from './SchemaValidator'
import { categories } from 'domain/entity/Mission'
import SchemaError from 'infra/errors/SchemaError'

export default class ZodSchemaValidator implements SchemaValidator {
  private validate(schema: ZodSchema, params: any, body: any) {
    try {
      schema.parse({ params, body })
    } catch (error) {
      if (error instanceof ZodError)
        throw new SchemaError(
          error.errors[0].code,
          error.errors[0].path.at(-1) as string,
        )
      else throw error
    }
  }

  getGame(params: any, body: any): void | SchemaError {
    const schema = z
      .object({
        body: z.object({}).optional(),
        params: z.object({
          gameId: z.coerce.number(),
        }),
      })
      .strict()
    this.validate(schema, params, body)
  }

  getGames(params: any, body: any): void | SchemaError {
    const schema = z
      .object({
        body: z.object({}).optional(),
        params: z.object({}).optional(),
      })
      .strict()
    this.validate(schema, params, body)
  }

  createGame(params: any, body: any): void | SchemaError {
    const schema = z
      .object({
        body: z.object({
          name: z.string().min(3).max(60),
          description: z.string().max(200),
        }),
        params: z.object({}).optional(),
      })
      .strict()
    this.validate(schema, params, body)
  }

  getMission(params: any, body: any): void | SchemaError {
    const schema = z.object({
      body: z.object({}).optional(),
      params: z.object({
        gameId: z.string(),
        missionId: z.string(),
      }),
    })
    this.validate(schema, params, body)
  }

  getMissions(params: any, body: any): void | SchemaError {
    const schema = z
      .object({
        body: z.object({}).optional(),
        params: z.object({
          gameId: z.string(),
        }),
      })
      .strict()
    this.validate(schema, params, body)
  }

  createMission(params: any, body: any): void | SchemaError {
    const schema = z
      .object({
        body: z.object({
          name: z.string().min(1).max(100),
          description: z.string().min(1).max(2000),
          points: z.number().int().min(0).max(999999999),
          category: z.enum(categories),
        }),
        params: z.object({
          gameId: z.string(),
        }),
      })
      .strict()
    this.validate(schema, params, body)
  }
}
