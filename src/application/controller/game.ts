import GameRepository from 'domain/repository/game'

import CreateGame from 'application/usecases/CreateGame'
import GetGame from 'application/usecases/GetGame'
import GetGames from 'application/usecases/GetGames'
import Http from 'infra/http/Http'
import SchemaValidator from 'infra/schema/SchemaValidator'

export default class GameController {
  constructor(
    readonly http: Http,
    readonly repository: GameRepository,
    readonly schemaValidator: SchemaValidator,
  ) {
    http.on('get', '/games/:gameId', async (params, body) => {
      schemaValidator.getGame(params, body)
      const getGame = new GetGame(repository)
      const game = await getGame.execute(Number(params.gameId))
      return { status: 200, body: game }
    })

    http.on('get', '/games', async (params, body) => {
      schemaValidator.getGames(params, body)
      const getGames = new GetGames(repository)
      const games = await getGames.execute()
      return { status: 200, body: games }
    })

    http.on('post', '/games', async (params, body) => {
      schemaValidator.createGame(params, body)
      const createGame = new CreateGame(repository)
      const game = await createGame.execute(body.name, body.description)
      return { status: 201, body: game }
    })
  }
}
