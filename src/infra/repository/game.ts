import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'

export default class GameRepositoryDatabase implements GameRepository {
  constructor(readonly repository: GameRepository) {}

  async get(id: number): Promise<Game> {
    return this.repository.get(id)
  }

  async list(): Promise<Game[]> {
    return this.repository.list()
  }

  async create(game: Game): Promise<Game> {
    return this.repository.create(game)
  }
}
