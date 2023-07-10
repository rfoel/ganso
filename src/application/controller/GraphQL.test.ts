import { describe, expect, it } from 'vitest'
import { gql } from 'graphql-tag'
import { print } from 'graphql/language/printer'
import { ASTNode } from 'graphql'

const request = async (query: ASTNode, variables?: Record<string, unknown>) => {
  const response = await fetch(`http://localhost:${process.env.PORT}/graphql`, {
    body: JSON.stringify({ query: print(query), variables }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
  })
  return await response.json()
}

describe('graphql', () => {
  describe('get games', () => {
    it('responds a list games', async () => {
      const response = await request(gql`
        {
          games {
            id
            name
          }
        }
      `)

      expect(response.data.games.length).toStrictEqual(expect.any(Number))
      expect(response.data.games).toMatchObject([
        expect.objectContaining({ id: '1', name: '5th Grade Math Fun!' }),
        expect.objectContaining({ id: '2', name: 'Toronto landmark hunt' }),
      ])
    })
  })

  describe('get game', () => {
    it('responds a game', async () => {
      const response = await request(
        gql`
          query ($gameId: ID!) {
            game(gameId: $gameId) {
              id
              name
            }
          }
        `,
        {
          gameId: '1',
        },
      )

      expect(response.data.game).toMatchObject({
        id: '1',
        name: '5th Grade Math Fun!',
      })
    })

    it('responds with a not found error if a game does not exist', async () => {
      const response = await request(
        gql`
          query ($gameId: ID!) {
            game(gameId: $gameId) {
              id
              name
            }
          }
        `,
        {
          gameId: '123456',
        },
      )

      expect(response.errors[0].message).toBe('No Game found')
    })
  })

  describe('create a game', () => {
    it('responds with the new game created', async () => {
      const game = {
        name: '50 State Challenge',
        description:
          'Complete this challenge with a group to help review all 50 states of the US.',
      }
      const response = await request(
        gql`
          mutation ($name: String!, $description: String!) {
            createGame(name: $name, description: $description) {
              id
              name
              description
            }
          }
        `,
        game,
      )

      expect(response.data.createGame).toMatchObject({
        ...game,
        id: expect.any(String),
      })
    })

    it('responds with an error if a field is missing', async () => {
      const game = {
        name: '50 State Challenge',
      }
      const response = await request(
        gql`
          mutation ($name: String!) {
            createGame(name: $name) {
              id
              name
              description
            }
          }
        `,
        game,
      )

      expect(response.errors[0].message).toBe(
        'Field "createGame" argument "description" of type "String!" is required, but it was not provided.',
      )
    })
  })

  describe('update a game', () => {
    it('responds with the game updated', async () => {
      const create = {
        name: 'Multi-layered motivating core',
        description:
          'Try to compress the USB bandwidth, maybe it will transmit the cross-platform firewall!',
      }

      const { data } = await request(
        gql`
          mutation ($name: String!, $description: String!) {
            createGame(name: $name, description: $description) {
              id
              name
              description
            }
          }
        `,
        create,
      )

      const game = {
        name: 'Secured neutral challenge',
      }
      const response = await request(
        gql`
          mutation ($id: ID!, $name: String!) {
            updateGame(id: $id, name: $name) {
              id
              name
              description
            }
          }
        `,
        { ...create, ...game, id: data.createGame.id },
      )

      expect(response.data.updateGame).toMatchObject({
        ...game,
        id: data.createGame.id,
      })
    })

    it('responds with an error if a field is missing', async () => {
      const game = {
        description:
          'The PCI transmitter is down, program the cross-platform monitor so we can bypass the SMTP system!',
      }

      const response = await request(
        gql`
          mutation ($description: String!) {
            updateGame(description: $description) {
              id
              name
              description
            }
          }
        `,
        game,
      )

      expect(response.errors[0].message).toBe(
        'Field "updateGame" argument "id" of type "ID!" is required, but it was not provided.',
      )
    })
  })

  describe('get missions', () => {
    it('responds with a list of missions from a game', async () => {
      const response = await request(
        gql`
          query ($gameId: ID!) {
            missions(gameId: $gameId) {
              id
              name
            }
          }
        `,
        { gameId: '1' },
      )

      expect(response.data.missions.length).toStrictEqual(expect.any(Number))
      expect(response.data.missions).toMatchObject([
        expect.objectContaining({
          id: '1',
          name: 'Barrels on Board',
        }),
        expect.objectContaining({
          id: '2',
          name: 'If you Sailed on the Mayflower',
        }),
        expect.objectContaining({
          id: '3',
          name: 'Groovy Potatoes',
        }),
      ])
    })

    it('responds with an error if a game does not exist', async () => {
      const response = await request(
        gql`
          query ($gameId: ID!) {
            missions(gameId: $gameId) {
              id
              name
            }
          }
        `,
        { gameId: '123456' },
      )

      expect(response.errors[0].message).toBe('No Game found')
    })

    describe('get mission', () => {
      it('responds with the details of a mission', async () => {
        const response = await request(
          gql`
            query ($gameId: ID!, $missionId: ID!) {
              mission(gameId: $gameId, missionId: $missionId) {
                id
                name
              }
            }
          `,
          { gameId: '1', missionId: '1' },
        )

        expect(response.data.mission).toMatchObject({
          id: '1',
          name: 'Barrels on Board',
        })
      })

      it('responds with an error if a mission does not exist', async () => {
        const response = await request(
          gql`
            query ($gameId: ID!, $missionId: ID!) {
              mission(gameId: $gameId, missionId: $missionId) {
                id
                name
              }
            }
          `,
          { gameId: '1', missionId: '123456' },
        )

        expect(response.errors[0].message).toBe('No Mission found')
      })
    })

    describe('create a mission', () => {
      it('responds with the new mission created', async () => {
        const mission = {
          name: 'Identify all 50 states on Practice Quiz',
          description:
            'Complete a practice quiz online and take a screenshot of your perfect score.',
          points: 100,
          category: 'PHOTO_AND_VIDEO',
        }
        const response = await request(
          gql`
            mutation (
              $name: String!
              $description: String!
              $points: Int!
              $category: Category!
              $gameId: ID!
            ) {
              createMission(
                name: $name
                description: $description
                points: $points
                category: $category
                gameId: $gameId
              ) {
                id
                name
                description
                category
                points
              }
            }
          `,
          { ...mission, gameId: '1' },
        )

        expect(response.data.createMission).toMatchObject(
          expect.objectContaining({ ...mission, id: expect.any(String) }),
        )
      })

      it('responds with an error if the game does not exist', async () => {
        const mission = {
          name: 'Identify all 50 states on Practice Quiz',
          description:
            'Complete a practice quiz online and take a screenshot of your perfect score.',
          points: 100,
          category: 'PHOTO_AND_VIDEO',
        }
        const response = await request(
          gql`
            mutation (
              $name: String!
              $description: String!
              $points: Int!
              $category: Category!
              $gameId: ID!
            ) {
              createMission(
                name: $name
                description: $description
                points: $points
                category: $category
                gameId: $gameId
              ) {
                id
                name
                description
              }
            }
          `,
          { ...mission, gameId: '123456' },
        )

        expect(response.errors[0].message).toBe('No Game found')
      })

      it('responds with an error if a field is missing', async () => {
        const mission = {
          name: 'Identify all 50 states on Practice Quiz',
          description:
            'Complete a practice quiz online and take a screenshot of your perfect score.',
          points: 100,
        }

        const response = await request(
          gql`
            mutation (
              $name: String!
              $description: String!
              $points: Int!
              $gameId: ID!
            ) {
              createMission(
                name: $name
                description: $description
                points: $points
                gameId: $gameId
              ) {
                id
                name
                description
              }
            }
          `,
          { ...mission, gameId: '123456' },
        )

        expect(response.errors[0].message).toBe(
          'Field "createMission" argument "category" of type "Category!" is required, but it was not provided.',
        )
      })

      it('responds with an error if a field has the wrong type', async () => {
        const mission = {
          name: 'Identify all 50 states on Practice Quiz',
          description:
            'Complete a practice quiz online and take a screenshot of your perfect score.',
          points: false,
          category: 'PHOTO_AND_VIDEO',
        }

        const response = await request(
          gql`
            mutation (
              $name: String!
              $description: String!
              $points: Int!
              $gameId: ID!
            ) {
              createMission(
                name: $name
                description: $description
                points: $points
                gameId: $gameId
              ) {
                id
                name
                description
              }
            }
          `,
          { ...mission, gameId: '1' },
        )

        expect(response.errors[0].message).toBe(
          'Field "createMission" argument "category" of type "Category!" is required, but it was not provided.',
        )
      })
    })
  })
})
