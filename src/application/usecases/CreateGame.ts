import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'

export default class CreateGame {
  constructor(readonly repository: GameRepository) {}

  async execute(name: string, description: string): Promise<Game> {
    const game = new Game(name, description)
    return this.repository.create(game)
  }
}
