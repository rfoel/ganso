import Mission, { Category } from 'domain/entity/mission'
import GameRepository from 'domain/repository/game'
import MissionRepository from 'domain/repository/mission'

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
    const game = await this.gameRepository.get(gameId)
    const mission = await this.missionRepository.create(
      new Mission(name, description, points, category, game),
    )
    return {
      category: mission.category,
      description: mission.description,
      name: mission.name,
      points: mission.points,
      id: mission.id,
    }
  }
}
