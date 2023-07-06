import { beforeAll, describe, expect, it } from 'vitest'

import CreateMission from 'application/usecases/CreateMission'
import GameRepositoryPrisma from 'infra/repository/prisma/game'
import Mission from 'domain/entity/mission'
import MissionRepositoryPrisma from 'infra/repository/prisma/mission'

describe('Use case - CreateMission', () => {
  let gameRepository: GameRepositoryPrisma
  let missionRepository: MissionRepositoryPrisma
  let usecase: CreateMission

  beforeAll(() => {
    gameRepository = new GameRepositoryPrisma()
    missionRepository = new MissionRepositoryPrisma()
    usecase = new CreateMission(missionRepository, gameRepository)
  })

  it('creates a new mission', async () => {
    const input = {
      name: 'Identify all 50 states on Practice Quiz',
      description:
        'Complete a practice quiz online and take a screenshot of your perfect score.',
      points: 100,
      category: 'photo+video',
      game: { description: '', name: '', id: 1 },
    } satisfies Mission
    const mission = await usecase.execute(
      input.name,
      input.description,
      input.points,
      input.category,
      input.game.id,
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
