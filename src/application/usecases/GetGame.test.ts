import { beforeAll, describe, expect, it } from 'vitest'

import Game from 'domain/entity/Game'
import Repository from 'infra/factory/Repository'
import GetGame from 'application/usecases/GetGame'

describe('Use case - GetGame', () => {
  let usecase: GetGame

  beforeAll(() => {
    const repository = new Repository(process.env.DB_STRATEGY)
    usecase = new GetGame(repository.game)
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
