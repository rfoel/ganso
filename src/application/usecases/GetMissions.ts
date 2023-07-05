import Mission from 'domain/entity/mission'
import MissionRepository from 'domain/repository/mission'

export default class GetMissions {
  constructor(readonly missionRepository: MissionRepository) {}

  async execute(gameId: number): Promise<Omit<Mission, 'game'>[]> {
    const missions = await this.missionRepository.list(gameId)
    return missions.map((mission) => ({
      category: mission.category,
      description: mission.description,
      name: mission.name,
      points: mission.points,
      id: mission.id,
    }))
  }
}
