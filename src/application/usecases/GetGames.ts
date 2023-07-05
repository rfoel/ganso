import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'

export default class GetGames {
  constructor(readonly repository: GameRepository) {}

  async execute(): Promise<Game[]> {
    return this.repository.list()
  }
}
