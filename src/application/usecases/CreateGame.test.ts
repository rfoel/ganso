import { beforeAll, describe, expect, it } from 'vitest'

import CreateGame from 'application/usecases/CreateGame'
import Game from 'domain/entity/game'
import gameRepository from 'infra/repository/game'

describe('Use case - CreateGame', () => {
  let usecase: CreateGame

  beforeAll(() => {
    usecase = new CreateGame(gameRepository)
  })

  it('creates a new game', async () => {
    const input = {
      name: '50 State Challenge',
      description:
        'Complete this challenge with a group to help review all 50 states of the US.',
    } satisfies Game
    const game = await usecase.execute(input.name, input.description)
    expect(game).toMatchObject({ ...input, id: expect.any(Number) })
  })
})
