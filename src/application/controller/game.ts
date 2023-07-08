import GameRepository from 'domain/repository/Game'

import CreateGame from 'application/usecases/CreateGame'
import GetGame from 'application/usecases/GetGame'
import GetGames from 'application/usecases/GetGames'
import UpdateGame from 'application/usecases/UpdateGame'
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
      const usecase = new GetGame(repository)
      const game = await usecase.execute(Number(params.gameId))
      return { status: 200, body: game }
    })

    http.on('get', '/games', async (params, body) => {
      schemaValidator.getGames(params, body)
      const usecase = new GetGames(repository)
      const games = await usecase.execute()
      return { status: 200, body: games }
    })

    http.on('post', '/games', async (params, body) => {
      schemaValidator.createGame(params, body)
      const usecase = new CreateGame(repository)
      const game = await usecase.execute(body.name, body.description)
      return { status: 201, body: game }
    })

    http.on('put', '/games/:gameId', async (params, body) => {
      schemaValidator.updateGame(params, body)
      const usecase = new UpdateGame(repository)
      const game = await usecase.execute(
        Number(params.gameId),
        body.name,
        body.description,
      )
      return { status: 200, body: game }
    })
  }
}
