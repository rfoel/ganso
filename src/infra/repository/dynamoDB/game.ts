import Dinamo from 'dinamo'

import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'
import NotFoundError from 'infra/errors/NotFoundError'

const dinamo = new Dinamo({ tableName: 'ganso', endpoint: process.env.DB_URL })

export default class GameRepositoryDynamoDB implements GameRepository {
  async get(id: number): Promise<Game> {
    const result = await dinamo.get<Game>({ key: { type: 'game', id } })
    if (!result) throw new NotFoundError('No Game found')
    return new Game(result.name, result.description, id)
  }

  async list(): Promise<Game[]> {
    const result = await dinamo.query<Game>({
      key: { type: 'game' },
      scanIndexForward: true,
    })
    return result.data.map(
      (item) => new Game(item.name, item.description, item.id),
    )
  }

  async create(game: Game): Promise<Game> {
    const gameCounter = await dinamo.increment<{ count: number }>({
      key: { type: 'gameCounter', id: 0 },
      field: 'count',
    })
    await dinamo.put({
      item: {
        description: game.description,
        name: game.name,
        type: 'game',
        id: gameCounter.count,
      },
    })
    return new Game(game.name, game.description, gameCounter.count)
  }
}
