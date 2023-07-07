import Dinamo from 'dinamo'

import Mission from 'domain/entity/mission'
import MissionRepository from 'domain/repository/mission'
import NotFoundError from 'infra/errors/NotFoundError'

const dinamo = new Dinamo({ tableName: 'ganso', endpoint: process.env.DB_URL })

export default class MissionRepositoryDynamoDB implements MissionRepository {
  async get(gameId: number, missionId: number): Promise<Mission> {
    const result = await dinamo.query<Mission>({
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
    const result = await dinamo.query<Mission>({
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
    const game = await dinamo.get({ key: { type: 'game', id: mission.gameId } })
    if (!game) throw new NotFoundError('No Game found')
    const missionCounter = await dinamo.increment<{ count: number }>({
      key: { type: 'missionCounter', id: 0 },
      field: 'count',
    })
    await dinamo.put({
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
