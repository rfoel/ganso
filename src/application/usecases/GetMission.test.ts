import { beforeAll, describe, expect, it } from 'vitest'

import Mission from 'domain/entity/Mission'
import GetMission from 'application/usecases/GetMission'
import Repository from 'infra/factory/Repository'

describe('Use case - GetMission', () => {
  let usecase: GetMission

  beforeAll(() => {
    const repository = new Repository(process.env.DB_STRATEGY)
    usecase = new GetMission(repository.mission)
  })

  it('gets a mission', async () => {
    const input = {
      name: 'Barrels on Board',
      description:
        'The Mayflower was one of the largest ships of her time. It could carry about 180 large barrels on board. If The pilgrims put the barrels in 15 rows, how many barrels would have been in each row?',
      points: 100,
      category: 'text',
      id: 1,
      gameId: 1,
    } satisfies Mission
    const mission = await usecase.execute(input.gameId, input.id)
    expect(mission).toMatchObject({
      id: input.id,
      name: input.name,
      description: input.description,
      points: input.points,
      category: input.category,
    })
  })
})
