import { beforeAll, describe, expect, it } from 'vitest'

import Game from 'domain/entity/game'
import gameRepository from 'infra/repository/game'
import GetGame from 'application/usecases/GetGame'

describe('Use case - GetGame', () => {
  let usecase: GetGame

  beforeAll(() => {
    usecase = new GetGame(gameRepository)
  })

  it('gets a game', async () => {
    const input = {
      name: '5th Grade Math Fun!',
      description:
        "Let's have some fun by going on a hunt! Solve these math problems and earn points along the way!",
      id: 1,
    } satisfies Game
    const game = await usecase.execute(input.id)
    expect(game).toMatchObject(input)
  })
})
