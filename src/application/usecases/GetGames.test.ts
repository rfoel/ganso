import { beforeAll, describe, expect, it } from 'vitest'

import Game from 'domain/entity/game'
import gameRepository from 'infra/repository/game'
import GetGames from 'application/usecases/GetGames'

describe('Use case - GetGames', () => {
  let usecase: GetGames

  beforeAll(() => {
    usecase = new GetGames(gameRepository)
  })

  it('gets a list of game', async () => {
    const games = await usecase.execute()
    expect(games).instanceOf(Array)
    expect(games.every((game) => game instanceof Game)).toBeTruthy()
  })
})
