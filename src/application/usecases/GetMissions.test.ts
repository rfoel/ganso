import { beforeAll, describe, expect, it } from 'vitest'

import Mission from 'domain/entity/mission'
import missionRepository from 'infra/repository/mission'
import GetMissions from 'application/usecases/GetMissions'

describe('Use case - GetMissions', () => {
  let usecase: GetMissions

  beforeAll(() => {
    usecase = new GetMissions(missionRepository)
  })

  it('gets a list of missions', async () => {
    const missions = await usecase.execute(1)
    expect(missions).instanceOf(Array)
    expect(missions.every((mission) => mission instanceof Mission)).toBeTruthy()
  })
})
