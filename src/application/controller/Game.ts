import CreateGame from 'application/usecases/CreateGame'
import GameRepository from 'domain/repository/Game'
import GetGame from 'application/usecases/GetGame'
import GetGames from 'application/usecases/GetGames'
import Http from 'infra/http/Http'
import SchemaValidator from 'infra/schema/SchemaValidator'
import UpdateGame from 'application/usecases/UpdateGame'

export default class GameController {
  constructor(
    readonly http: Http,
    readonly repository: GameRepository,
    readonly schemaValidator: SchemaValidator,
  ) {
    http.rest('get', '/games/:gameId', async (params, body) => {
      schemaValidator.getGame(params, body)
      const usecase = new GetGame(repository)
      const game = await usecase.execute(Number(params.gameId))
      return { status: 200, body: game }
    })

    http.rest('get', '/games', async (params, body) => {
      schemaValidator.getGames(params, body)
      const usecase = new GetGames(repository)
      const games = await usecase.execute()
      return { status: 200, body: games }
    })

    http.rest('post', '/games', async (params, body) => {
      schemaValidator.createGame(params, body)
      const usecase = new CreateGame(repository)
      const game = await usecase.execute(body.name, body.description)
      return { status: 201, body: game }
    })

    http.rest('put', '/games/:gameId', async (params, body) => {
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
