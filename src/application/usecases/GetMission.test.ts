import { beforeAll, describe, expect, it } from 'vitest'

import Mission from 'domain/entity/mission'
import MissionRepositoryPrisma from 'infra/repository/prisma/mission'
import GetMission from 'application/usecases/GetMission'

describe('Use case - GetMission', () => {
  let missionRepository: MissionRepositoryPrisma
  let usecase: GetMission

  beforeAll(() => {
    missionRepository = new MissionRepositoryPrisma()
    usecase = new GetMission(missionRepository)
  })

  it('gets a mission', async () => {
    const input = {
      name: 'Barrels on Board',
      description:
        'The Mayflower was one of the largest ships of her time. It could carry about 180 large barrels on board. If The pilgrims put the barrels in 15 rows, how many barrels would have been in each row?',
      points: 100,
      category: 'text',
      id: 1,
      game: {
        description:
          "Let's have some fun by going on a hunt! Solve these math problems and earn points along the way!",
        id: 1,
        name: '5th Grade Math Fun!',
      },
    } satisfies Mission
    const mission = await usecase.execute(input.game.id, input.id)
    expect(mission).toMatchObject({
      id: input.id,
      name: input.name,
      description: input.description,
      points: input.points,
      category: input.category,
    })
  })
})
