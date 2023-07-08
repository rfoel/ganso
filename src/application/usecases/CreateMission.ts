import GameRepository from 'domain/repository/Game'
import Mission, { Category } from 'domain/entity/Mission'
import MissionRepository from 'domain/repository/Mission'

export default class CreateMission {
  constructor(
    readonly missionRepository: MissionRepository,
    readonly gameRepository: GameRepository,
  ) {}

  async execute(
    name: string,
    description: string,
    points: number,
    category: Category,
    gameId: number,
  ): Promise<Omit<Mission, 'game'>> {
    const mission = await this.missionRepository.create(
      new Mission(name, description, points, category, gameId),
    )
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
