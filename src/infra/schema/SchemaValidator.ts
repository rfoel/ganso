import SchemaError from 'infra/errors/SchemaError'

export default interface SchemaValidator {
  getGame(params: any, body: any): void | SchemaError

  getGames(params: any, body: any): void | SchemaError

  createGame(params: any, body: any): void | SchemaError

  getMission(params: any, body: any): void | SchemaError

  getMissions(params: any, body: any): void | SchemaError

  createMission(params: any, body: any): void | SchemaError

  updateGame(params: any, body: any): void | SchemaError
}
