import Mission from 'domain/entity/mission'
import MissionRepository from 'domain/repository/mission'

export default class GetMission {
  constructor(readonly missionRepository: MissionRepository) {}

  async execute(
    gameId: number,
    missionId: number,
  ): Promise<Omit<Mission, 'game'>> {
    const mission = await this.missionRepository.get(gameId, missionId)
    return {
      category: mission.category,
      description: mission.description,
      name: mission.name,
      points: mission.points,
      id: mission.id,
      gameId,
    }
  }
}
