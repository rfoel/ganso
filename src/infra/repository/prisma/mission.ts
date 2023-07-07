import { Prisma, PrismaClient } from '@prisma/client'

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
      })

      return new Mission(
        result.name,
        result.description,
        result.points,
        getCategory(result.category) as Category,
        gameId,
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
        include: { missions: { orderBy: { id: 'asc' } } },
      })

      return result.missions.map(
        (item) =>
          new Mission(
            item.name,
            item.description,
            item.points,
            getCategory(item.category) as Category,
            gameId,
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
    try {
      await prisma.game.findUniqueOrThrow({
        where: { id: mission.gameId },
      })
      const result = await prisma.mission.create({
        data: {
          category: getPrismaCategory(mission.category),
          description: mission.description,
          name: mission.name,
          points: mission.points,
          game: { connect: { id: mission.gameId } },
        },
      })

      return new Mission(
        result.name,
        result.description,
        result.points,
        getCategory(result.category) as Category,
        mission.gameId,
        result.id,
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundError(error.message)
      else throw error
    }
  }
}
