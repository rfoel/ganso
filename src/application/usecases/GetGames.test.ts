import { beforeAll, describe, expect, it } from 'vitest'

import Game from 'domain/entity/game'
import GameRepositoryPrisma from 'infra/repository/prisma/game'
import GetGames from 'application/usecases/GetGames'

describe('Use case - GetGames', () => {
  let gameRepository: GameRepositoryPrisma
  let usecase: GetGames

  beforeAll(() => {
    gameRepository = new GameRepositoryPrisma()
    usecase = new GetGames(gameRepository)
  })

  it('gets a list of game', async () => {
    const games = await usecase.execute()
    expect(games).instanceOf(Array)
    expect(games.every((game) => game instanceof Game)).toBeTruthy()
  })
})
