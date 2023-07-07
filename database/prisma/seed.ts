import { PrismaClient } from '@prisma/client'

import seed from '../seed'
import { getPrismaCategory } from 'infra/repository/prisma/category'

const prisma = new PrismaClient()

console.log(`Start seeding ...`)

for (const data of seed) {
  const { missions, ...gameData } = data
  const game = await prisma.game.create({
    data: {
      ...gameData,
      missions: {
        create: missions.map((mission) => ({
          ...mission,
          category: getPrismaCategory(mission.category),
        })),
      },
    },
  })
  console.log(`Created game with id: ${game.id as number}`)
}

console.log(`Seeding finished.`)

await prisma.$disconnect()

process.exit(0)
