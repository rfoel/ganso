import Game from 'domain/entity/Game'
import GameRepository from 'domain/repository/Game'

export default class GetGame {
  constructor(readonly repository: GameRepository) {}

  async execute(id: number): Promise<Game> {
    return await this.repository.get(id)
  }
}
