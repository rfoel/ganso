import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'

export default class GetGame {
  constructor(readonly repository: GameRepository) {}

  async execute(id: number): Promise<Game> {
    return this.repository.get(id)
  }
}
