import GameRepository from 'domain/repository/Game'
import GameRepositoryPrisma from 'infra/repository/prisma/Game'
import GameRepositoryDynamoDB from 'infra/repository/dynamoDB/Game'
import RepositoryFactory from 'domain/factory/Repository'
import MissionRepository from 'domain/repository/Mission'
import MissionRepositoryPrisma from 'infra/repository/prisma/Mission'
import MissionRepositoryDynamoDB from 'infra/repository/dynamoDB/Mission'
import { PrismaClient } from '@prisma/client'
import Dinamo from 'dinamo'

export default class Repository implements RepositoryFactory {
  game: GameRepository
  mission: MissionRepository

  constructor(readonly strategy: string) {
    if (process.env.DB_STRATEGY === 'postgres') {
      const prisma = new PrismaClient()
      this.game = new GameRepositoryPrisma(prisma)
      this.mission = new MissionRepositoryPrisma(prisma)
    } else if (process.env.DB_STRATEGY === 'dynamo') {
      const dinamo = new Dinamo({
        tableName: 'ganso',
        endpoint: process.env.DYNAMO_DB_URL,
      })
      this.game = new GameRepositoryDynamoDB(dinamo)
      this.mission = new MissionRepositoryDynamoDB(dinamo)
    } else throw Error('No database strategy provided')
  }
}
