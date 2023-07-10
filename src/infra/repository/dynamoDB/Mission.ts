import Dinamo from 'dinamo'

import Mission from 'domain/entity/Mission'
import MissionRepository from 'domain/repository/Mission'
import NotFoundError from 'infra/errors/NotFoundError'

export default class MissionRepositoryDynamoDB implements MissionRepository {
  constructor(readonly dinamo: Dinamo) {}

  async get(gameId: number, missionId: number): Promise<Mission> {
    const result = await this.dinamo.query<Mission>({
      key: { type: 'mission', id: missionId },
      query: { gameId },
    })
    if (!result.data[0]) throw new NotFoundError('No Mission found')
    return new Mission(
      result.data[0].name,
      result.data[0].description,
      result.data[0].points,
      result.data[0].category,
      result.data[0].gameId,
      missionId,
    )
  }

  async list(gameId: number): Promise<Mission[]> {
    const game = await this.dinamo.get({
      key: { type: 'game', id: gameId },
    })
    if (!game) throw new NotFoundError('No Game found')
    const result = await this.dinamo.query<Mission>({
      key: { gameId },
      indexName: 'missionIndex',
    })
    return result.data.map(
      (item) =>
        new Mission(
          item.name,
          item.description,
          item.points,
          item.category,
          gameId,
          item.id,
        ),
    )
  }

  async create(mission: Mission): Promise<Mission> {
    const game = await this.dinamo.get({
      key: { type: 'game', id: mission.gameId },
    })
    if (!game) throw new NotFoundError('No Game found')
    const missionCounter = await this.dinamo.increment<{ count: number }>({
      key: { type: 'missionCounter', id: 0 },
      field: 'count',
    })
    await this.dinamo.put({
      item: {
        description: mission.description,
        name: mission.name,
        type: 'mission',
        id: missionCounter.count,
        gameId: mission.gameId,
      },
    })
    return new Mission(
      mission.name,
      mission.description,
      mission.points,
      mission.category,
      mission.gameId,
      missionCounter.count,
    )
  }
}
