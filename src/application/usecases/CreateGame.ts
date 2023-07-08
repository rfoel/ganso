import Game from 'domain/entity/Game'
import GameRepository from 'domain/repository/Game'

export default class CreateGame {
  constructor(readonly repository: GameRepository) {}

  async execute(name: string, description: string): Promise<Required<Game>> {
    const game = new Game(name, description)
    return this.repository.create(game)
  }
}
