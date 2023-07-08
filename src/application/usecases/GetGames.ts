import Game from 'domain/entity/Game'
import GameRepository from 'domain/repository/Game'

export default class GetGames {
  constructor(readonly repository: GameRepository) {}

  async execute(): Promise<Game[]> {
    return this.repository.list()
  }
}
