import { Prisma, PrismaClient } from '@prisma/client'

import Game from 'domain/entity/Game'
import GameRepository from 'domain/repository/Game'
import NotFoundError from 'infra/errors/NotFoundError'

export default class GameRepositoryPrisma implements GameRepository {
  constructor(readonly prisma: PrismaClient) {}

  async get(id: number): Promise<Game> {
    try {
      const result = await this.prisma.game.findFirstOrThrow({ where: { id } })
      return new Game(result.name, result.description, result.id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundError(error.message)
      else throw error
    }
  }

  async list(): Promise<Game[]> {
    const result = await this.prisma.game.findMany({ orderBy: { id: 'asc' } })
    return result.map((item) => new Game(item.name, item.description, item.id))
  }

  async create(game: Game): Promise<Required<Game>> {
    const result = await this.prisma.game.create({
      data: { description: game.description, name: game.name },
    })
    return new Game(
      result.name,
      result.description,
      result.id,
    ) as Required<Game>
  }

  async update(game: Required<Game>): Promise<Game> {
    try {
      await this.prisma.game.findUniqueOrThrow({
        where: { id: game.id },
      })
      const result = await this.prisma.game.update({
        where: { id: game.id },
        data: { description: game.description, name: game.name },
      })
      return new Game(result.name, result.description, game.id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundError(error.message)
      else throw error
    }
  }
}
