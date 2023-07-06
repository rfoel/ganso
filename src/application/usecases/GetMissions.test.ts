import { beforeAll, describe, expect, it } from 'vitest'

import Mission from 'domain/entity/mission'
import MissionRepositoryPrisma from 'infra/repository/prisma/mission'
import GetMissions from 'application/usecases/GetMissions'

describe('Use case - GetMissions', () => {
  let missionRepository: MissionRepositoryPrisma
  let usecase: GetMissions

  beforeAll(() => {
    missionRepository = new MissionRepositoryPrisma()
    usecase = new GetMissions(missionRepository)
  })

  it('gets a list of missions', async () => {
    const missions = await usecase.execute(1)
    expect(missions).instanceOf(Array)
    expect(missions.every((mission) => mission instanceof Mission)).toBeTruthy()
  })
})
