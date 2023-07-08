import Dinamo from 'dinamo'

import Game from 'domain/entity/Game'
import GameRepository from 'domain/repository/Game'
import NotFoundError from 'infra/errors/NotFoundError'

export default class GameRepositoryDynamoDB implements GameRepository {
  constructor(readonly dinamo: Dinamo) {}

  async get(id: number): Promise<Game> {
    const result = await this.dinamo.get<Game>({ key: { type: 'game', id } })
    if (!result) throw new NotFoundError('No Game found')
    return new Game(result.name, result.description, id)
  }

  async list(): Promise<Game[]> {
    const result = await this.dinamo.query<Game>({
      key: { type: 'game' },
      scanIndexForward: true,
    })
    return result.data.map(
      (item) => new Game(item.name, item.description, item.id),
    )
  }

  async create(game: Game): Promise<Game> {
    const gameCounter = await this.dinamo.increment<{ count: number }>({
      key: { type: 'gameCounter', id: 0 },
      field: 'count',
    })
    await this.dinamo.put({
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
