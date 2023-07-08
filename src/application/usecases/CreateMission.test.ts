import { beforeAll, describe, expect, it } from 'vitest'

import CreateMission from 'application/usecases/CreateMission'
import Mission from 'domain/entity/Mission'
import Repository from 'infra/factory/Repository'

describe('Use case - CreateMission', () => {
  let usecase: CreateMission

  beforeAll(() => {
    const repository = new Repository(process.env.DB_STRATEGY)
    usecase = new CreateMission(repository.mission, repository.game)
  })

  it('creates a new mission', async () => {
    const input = {
      name: 'Identify all 50 states on Practice Quiz',
      description:
        'Complete a practice quiz online and take a screenshot of your perfect score.',
      points: 100,
      category: 'photo+video',
      gameId: 1,
    } satisfies Mission
    const mission = await usecase.execute(
      input.name,
      input.description,
      input.points,
      input.category,
      input.gameId,
    )
    expect(mission).toMatchObject({
      id: expect.any(Number),
      name: input.name,
      description: input.description,
      points: input.points,
      category: input.category,
    })
  })
})
