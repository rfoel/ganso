import { Prisma, PrismaClient } from '@prisma/client'

import Game from 'domain/entity/game'
import Mission, { Category } from 'domain/entity/mission'
import MissionRepository from 'domain/repository/mission'
import NotFoundError from 'infra/errors/NotFoundError'
import { getCategory, getPrismaCategory } from './category'

const prisma = new PrismaClient()

export default class MissionRepositoryPrisma implements MissionRepository {
  async get(gameId: number, missionId: number): Promise<Mission> {
    try {
      const result = await prisma.mission.findUniqueOrThrow({
        where: { id_gameId: { gameId, id: missionId } },
        include: { game: true },
      })
      const game = new Game(
        result.game.name,
        result.game.description,
        result.game.id,
      )

      return new Mission(
        result.name,
        result.description,
        result.points,
        getCategory(result.category) as Category,
        game,
        result.id,
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundError(error.message)
      else throw error
    }
  }

  async list(gameId: number): Promise<Mission[]> {
    try {
      const result = await prisma.game.findUniqueOrThrow({
        where: { id: gameId },
        include: { missions: true },
      })

      const game = new Game(result.name, result.description, result.id)

      return result.missions.map(
        (item) =>
          new Mission(
            item.name,
            item.description,
            item.points,
            getCategory(item.category) as Category,
            game,
            item.id,
          ),
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundError(error.message)
      else throw error
    }
  }

  async create(mission: Mission): Promise<Mission> {
    const result = await prisma.mission.create({
      data: {
        category: getPrismaCategory(mission.category),
        description: mission.description,
        name: mission.name,
        points: mission.points,
        game: { connect: { id: mission.game.id } },
      },
    })

    return new Mission(
      result.name,
      result.description,
      result.points,
      getCategory(result.category) as Category,
      mission.game,
      result.id,
    )
  }
}
