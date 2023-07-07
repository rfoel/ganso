import {
  CreateTableCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb'
import Dinamo from 'dinamo'

import seed from '../seed'

const dinamo = new Dinamo({
  tableName: 'ganso',
  endpoint: 'http://localhost:8000',
})

try {
  await dinamo.client.send(new DeleteTableCommand({ TableName: 'ganso' }))
} catch {
  /** noop */
} finally {
  await dinamo.client.send(
    new CreateTableCommand({
      TableName: 'ganso',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'type', KeyType: 'HASH' },
        { AttributeName: 'id', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'type', AttributeType: 'S' },
        { AttributeName: 'id', AttributeType: 'N' },
        { AttributeName: 'gameId', AttributeType: 'N' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'missionIndex',
          Projection: { ProjectionType: 'ALL' },
          KeySchema: [
            { AttributeName: 'gameId', KeyType: 'HASH' },
            { AttributeName: 'id', KeyType: 'RANGE' },
          ],
        },
      ],
    }),
  )
}

await dinamo.put({ item: { type: 'gameCounter', id: 0, count: 0 } })
await dinamo.put({ item: { type: 'missionCounter', id: 0, count: 0 } })

console.log('Seeding...')

for (const game of seed) {
  const gameCounter = await dinamo.increment<{ count: number }>({
    key: { type: 'gameCounter', id: 0 },
    field: 'count',
  })
  await dinamo.put({
    item: {
      name: game.name,
      description: game.description,
      type: 'game',
      id: gameCounter.count,
    },
  })

  for (const mission of game.missions) {
    const missionCounter = await dinamo.increment<{ count: number }>({
      key: { type: 'missionCounter', id: 0 },
      field: 'count',
    })
    await dinamo.put({
      item: {
        name: mission.name,
        description: mission.description,
        points: mission.points,
        category: mission.category,
        type: 'mission',
        id: missionCounter.count,
        gameId: gameCounter.count,
      },
    })
  }
  console.log(`Created game with id: ${gameCounter.count}`)
}
console.log('Done!')
