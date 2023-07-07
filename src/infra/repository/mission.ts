import Mission from 'domain/entity/mission'
import MissionRepository from 'domain/repository/mission'
// import MissionRepositoryPrisma from 'infra/repository/prisma/mission'
import MissionRepositoryDynamoDB from 'infra/repository/dynamoDB/mission'

// const missionRepository = new MissionRepositoryPrisma()
const missionRepository = new MissionRepositoryDynamoDB()

class MissionRepositoryDatabase implements MissionRepository {
  constructor(readonly repository: MissionRepository) {}

  async get(gameId: number, missionId: number): Promise<Mission> {
    return this.repository.get(gameId, missionId)
  }

  async list(gameId: number): Promise<Mission[]> {
    return this.repository.list(gameId)
  }

  async create(mission: Mission): Promise<Mission> {
    return this.repository.create(mission)
  }
}

export default new MissionRepositoryDatabase(missionRepository)
