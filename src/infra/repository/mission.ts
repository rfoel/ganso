import Mission from 'domain/entity/mission'
import MissionRepository from 'domain/repository/mission'

export default class MissionRepositoryDatabase implements MissionRepository {
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
