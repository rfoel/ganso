import Mission from 'domain/entity/Mission'
import MissionRepository from 'domain/repository/Mission'

export default class GetMissions {
  constructor(readonly missionRepository: MissionRepository) {}

  async execute(gameId: number): Promise<Omit<Mission, 'game'>[]> {
    const missions = await this.missionRepository.list(gameId)
    return missions.map(
      (mission) =>
        new Mission(
          mission.name,
          mission.description,
          mission.points,
          mission.category,
          gameId,
          mission.id,
        ),
    )
  }
}
