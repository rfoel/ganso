import CreateMission from 'application/usecases/CreateMission'
import GameRepository from 'domain/repository/Game'
import GetMission from 'application/usecases/GetMission'
import GetMissions from 'application/usecases/GetMissions'
import Http from 'infra/http/Http'
import MissionRepository from 'domain/repository/Mission'
import SchemaValidator from 'infra/schema/SchemaValidator'

export default class MissionController {
  constructor(
    readonly http: Http,
    readonly missionRepository: MissionRepository,
    readonly gameRepository: GameRepository,
    readonly schemaValidator: SchemaValidator,
  ) {
    http.on(
      'get',
      '/games/:gameId/missions/:missionId',
      async (params, body) => {
        schemaValidator.getMission(params, body)
        const usecase = new GetMission(missionRepository)
        const mission = await usecase.execute(
          Number(params.gameId),
          Number(params.missionId),
        )
        return { status: 200, body: mission }
      },
    )

    http.on('get', '/games/:gameId/missions', async (params, body) => {
      schemaValidator.getMissions(params, body)
      const usecase = new GetMissions(missionRepository)
      const missions = await usecase.execute(Number(params.gameId))
      return { status: 200, body: missions }
    })

    http.on('post', '/games/:gameId/missions', async (params, body) => {
      schemaValidator.createMission(params, body)
      const usecase = new CreateMission(missionRepository, gameRepository)
      const mission = await usecase.execute(
        body.name,
        body.description,
        body.points,
        body.category,
        Number(params.gameId),
      )
      return { status: 201, body: mission }
    })
  }
}
