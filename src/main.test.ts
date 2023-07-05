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
      expect(response.body.length).toBe(2)
      expect(response.body[0].name).toBe('5th Grade Math Fun!')
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

  describe('GET /games/:id/missions', () => {
    it('responds with a 200 status code and list missions from a game', async () => {
      const response = await request('/games/1/missions')

      expect(response.status).toBe(200)
      expect(response.body.length).toBe(3)
      expect(response.body[0].name).toBe('Barrels on Board')
    })

    it('responds with a 404 status code if a game does not exist', async () => {
      const response = await request('/games/123456')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('No Game found')
    })
  })

  describe('GET /games/:id/missions/:missionId', () => {
    it('responds with a 200 status code and the details of a mission', async () => {
      const response = await request('/games/1/missions/1')

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Barrels on Board')
    })

    it('responds with a 404 status code if a mission does not exist', async () => {
      const response = await request('/games/1/missions/123456')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('No Mission found')
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
      expect(response.body.message).toBe('body.description: Required')
    })
  })

  describe('POST /games/:gameId/missions', () => {
    it('responds with a 201 status code and the new mission created', async () => {
      const mission = {
        name: 'Identify all 50 states on Practice Quiz',
        description:
          'Complete a practice quiz online and take a screenshot of your perfect score.',
        points: 100,
        category: 'photo+video',
      }
      const response = await request('/games/1/missions', mission, 'post')

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(mission)
    })

    it('responds with a 404 status code if the game does not exist', async () => {
      const mission = {
        name: 'Identify all 50 states on Practice Quiz',
        description:
          'Complete a practice quiz online and take a screenshot of your perfect score.',
        points: 100,
        category: 'photo+video',
      }
      const response = await request('/games/123456/missions', mission, 'post')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('No Game found')
    })

    it('responds with a 422 status code if a field is missing', async () => {
      const mission = {
        name: 'Identify all 50 states on Practice Quiz',
        description:
          'Complete a practice quiz online and take a screenshot of your perfect score.',
        points: 100,
      }

      const response = await request('/games/1/missions', mission, 'post')

      expect(response.status).toBe(422)
      expect(response.body.message).toBe('body.category: Required')
    })

    it('responds with a 422 status code if a field has the wrong type', async () => {
      const mission = {
        name: 'Identify all 50 states on Practice Quiz',
        description:
          'Complete a practice quiz online and take a screenshot of your perfect score.',
        points: false,
        category: 'photo+video',
      }

      const response = await request('/games/1/missions', mission, 'post')

      expect(response.status).toBe(422)
      expect(response.body.message).toBe(
        'body.points: Expected number, received boolean',
      )
    })
  })
})
