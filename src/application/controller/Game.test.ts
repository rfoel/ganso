import { describe, expect, it } from 'vitest'

const request = async (path: string, body?: any, method = 'get') => {
  const response = await fetch(`http://localhost:${process.env.PORT}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return { status: response.status, body: await response.json() }
}

describe('games', () => {
  describe('GET /games', () => {
    it('responds with a 200 status code and list games', async () => {
      const response = await request('/games')

      expect(response.status).toBe(200)
      expect(response.body.length).toStrictEqual(expect.any(Number))
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, name: '5th Grade Math Fun!' }),
          expect.objectContaining({ id: 2, name: 'Toronto landmark hunt' }),
        ]),
      )
    })
  })

  describe('GET /games/:id', () => {
    it('responds with a 200 status code and the details of a game', async () => {
      const response = await request('/games/1')

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('5th Grade Math Fun!')
    })

    it('responds with a 404 status code if a game does not exist', async () => {
      const response = await request('/games/123456')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('No Game found')
    })
  })

  describe('POST /games', () => {
    it('responds with a 201 status code and the new game created', async () => {
      const game = {
        name: '50 State Challenge',
        description:
          'Complete this challenge with a group to help review all 50 states of the US.',
      }
      const response = await request('/games', game, 'post')

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(game)
    })

    it('responds with a 422 status code if a field is missing', async () => {
      const game = {
        name: '50 State Challenge',
      }

      const response = await request('/games', game, 'post')

      expect(response.status).toBe(422)
      expect(response.body.code).toStrictEqual(expect.any(String))
      expect(response.body.field).toBe('description')
    })
  })

  describe('PUT /games/:gameId', () => {
    it('responds with a 200 status code and the game updated', async () => {
      const create = {
        name: 'Multi-layered motivating core',
        description:
          'Try to compress the USB bandwidth, maybe it will transmit the cross-platform firewall!',
      }

      const { body } = await request('/games', create, 'post')

      const game = {
        name: 'Secured neutral challenge',
        description:
          'The PCI transmitter is down, program the cross-platform monitor so we can bypass the SMTP system!',
      }
      const response = await request(`/games/${body.id}`, game, 'put')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({ ...game, id: body.id })
    })

    it('responds with a 422 status code if a field is missing', async () => {
      const game = {
        description:
          'The PCI transmitter is down, program the cross-platform monitor so we can bypass the SMTP system!',
      }

      const response = await request('/games/1', game, 'put')

      expect(response.status).toBe(422)
      expect(response.body.code).toStrictEqual(expect.any(String))
      expect(response.body.field).toBe('name')
    })
  })
})