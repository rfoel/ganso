import joi from 'joi'

import SchemaValidator from './SchemaValidator'
import { categories } from 'domain/entity/Mission'
import SchemaError from 'infra/errors/SchemaError'

export default class ZodSchemaValidator implements SchemaValidator {
  private validate(schema: joi.Schema, params: any, body: any) {
    try {
      const isValid = schema.validate({ params, body })
      if (isValid.error) throw isValid.error
    } catch (error) {
      if (error instanceof joi.ValidationError)
        throw new SchemaError(
          error.details[0].type,
          error.details[0].path.at(-1) as string,
        )
      else throw error
    }
  }

  getGame(params: any, body: any): void | SchemaError {
    const schema = joi.object({
      body: joi.object({}),
      params: joi
        .object({
          gameId: joi.number().required(),
        })
        .required(),
    })
    this.validate(schema, params, body)
  }

  getGames(params: any, body: any): void | SchemaError {
    const schema = joi
      .object({
        body: joi.object({}),
        params: joi.object({}),
      })
      .required()
    this.validate(schema, params, body)
  }

  createGame(params: any, body: any): void | SchemaError {
    const schema = joi.object({
      body: joi
        .object({
          name: joi.string().min(3).max(60).required(),
          description: joi.string().max(200).required(),
        })
        .required(),
      params: joi.object({}),
    })
    this.validate(schema, params, body)
  }

  getMission(params: any, body: any): void | SchemaError {
    const schema = joi.object({
      body: joi.object({}),
      params: joi
        .object({
          gameId: joi.string().required(),
          missionId: joi.string().required(),
        })
        .required(),
    })
    this.validate(schema, params, body)
  }

  getMissions(params: any, body: any): void | SchemaError {
    const schema = joi.object({
      body: joi.object({}),
      params: joi
        .object({
          gameId: joi.number().required(),
        })
        .required(),
    })
    this.validate(schema, params, body)
  }

  createMission(params: any, body: any): void | SchemaError {
    const schema = joi.object({
      body: joi
        .object({
          name: joi.string().min(1).max(100).required(),
          description: joi.string().min(1).max(2000).required(),
          points: joi.number().integer().min(0).max(999999999).required(),
          category: joi
            .string()
            .valid(...categories)
            .required(),
        })
        .required(),
      params: joi
        .object({
          gameId: joi.string().required(),
        })
        .required(),
    })
    this.validate(schema, params, body)
  }
}
