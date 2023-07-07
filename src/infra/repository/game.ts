import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'
// import GameRepositoryPrisma from 'infra/repository/prisma/game'
import GameRepositoryDynamoDB from 'infra/repository/dynamoDB/game'

// const gameRepository = new GameRepositoryPrisma()
const gameRepository = new GameRepositoryDynamoDB()

class GameRepositoryDatabase implements GameRepository {
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

export default new GameRepositoryDatabase(gameRepository)
