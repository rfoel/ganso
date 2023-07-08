import { beforeAll, describe, expect, it } from 'vitest'

import CreateGame from 'application/usecases/CreateGame'
import UpdateGame from 'application/usecases/UpdateGame'
import Game from 'domain/entity/Game'
import Repository from 'infra/factory/Repository'

describe('Use case - UpdateGame', () => {
  let usecase: UpdateGame, createGameUsecase: CreateGame

  beforeAll(() => {
    const repository = new Repository(process.env.DB_STRATEGY)
    createGameUsecase = new CreateGame(repository.game)
    usecase = new UpdateGame(repository.game)
  })

  it('updates a game', async () => {
    const create = {
      name: 'Multi-layered motivating core',
      description:
        'Try to compress the USB bandwidth, maybe it will transmit the cross-platform firewall!',
    } satisfies Game
    const gameCreated = await createGameUsecase.execute(
      create.name,
      create.description,
    )
    expect(gameCreated).toMatchObject({ ...create, id: expect.any(Number) })

    const update = {
      name: 'Secured neutral challenge',
      description:
        'The PCI transmitter is down, program the cross-platform monitor so we can bypass the SMTP system!',
    } satisfies Game
    const gameUpdated = await usecase.execute(
      gameCreated.id,
      update.name,
      update.description,
    )
    expect(gameUpdated).toMatchObject({ ...update, id: gameCreated.id })
  })
})
