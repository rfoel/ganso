import { beforeAll, describe, expect, it } from 'vitest'

import Mission from 'domain/entity/Mission'
import GetMissions from 'application/usecases/GetMissions'
import Repository from 'infra/factory/Repository'

describe('Use case - GetMissions', () => {
  let usecase: GetMissions

  beforeAll(() => {
    const repository = new Repository(process.env.DB_STRATEGY)
    usecase = new GetMissions(repository.mission)
  })

  it('gets a list of missions', async () => {
    const missions = await usecase.execute(1)
    expect(missions).instanceOf(Array)
    expect(missions.every((mission) => mission instanceof Mission)).toBeTruthy()
  })
})
