import Game from 'domain/entity/Game'
import GameRepository from 'domain/repository/Game'

export default class CreateGame {
  constructor(readonly repository: GameRepository) {}

  async execute(id: number, name: string, description: string): Promise<Game> {
    const game = new Game(name, description, id)
    return await this.repository.update(game as Required<Game>)
  }
}
