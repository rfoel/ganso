import { beforeAll, describe, expect, it } from 'vitest'

import Game from 'domain/entity/Game'
import GetGames from 'application/usecases/GetGames'
import Repository from 'infra/factory/Repository'

describe('Use case - GetGames', () => {
  let usecase: GetGames

  beforeAll(() => {
    const repository = new Repository(process.env.DB_STRATEGY)
    usecase = new GetGames(repository.game)
  })

  it('gets a list of game', async () => {
    const games = await usecase.execute()
    expect(games).instanceOf(Array)
    expect(games.every((game) => game instanceof Game)).toBeTruthy()
  })
})
