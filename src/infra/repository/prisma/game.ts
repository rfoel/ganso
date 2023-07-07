import { Prisma, PrismaClient } from '@prisma/client'

import Game from 'domain/entity/game'
import GameRepository from 'domain/repository/game'
import NotFoundError from 'infra/errors/NotFoundError'

const prisma = new PrismaClient()

export default class GameRepositoryPrisma implements GameRepository {
  async get(id: number): Promise<Game> {
    try {
      const result = await prisma.game.findFirstOrThrow({ where: { id } })

      return new Game(result.name, result.description, result.id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundError(error.message)
      else throw error
    }
  }

  async list(): Promise<Game[]> {
    const result = await prisma.game.findMany({ orderBy: { id: 'asc' } })
    return result.map((item) => new Game(item.name, item.description, item.id))
  }

  async create(game: Game): Promise<Game> {
    const result = await prisma.game.create({
      data: { description: game.description, name: game.name },
    })
    return new Game(result.name, result.description, result.id)
  }
}
