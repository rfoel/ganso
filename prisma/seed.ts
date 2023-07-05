import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const gameData: Prisma.GameCreateInput[] = [
  {
    name: '5th Grade Math Fun!',
    description:
      "Let's have some fun by going on a hunt! Solve these math problems and earn points along the way!",
    missions: {
      create: [
        {
          name: 'Barrels on Board',
          description:
            'The Mayflower was one of the largest ships of her time. It could carry about 180 large barrels on board. If The pilgrims put the barrels in 15 rows, how many barrels would have been in each row?',
          points: 100,
          category: 'TEXT',
        },
        {
          name: 'If you Sailed on the Mayflower',
          description:
            'Use the book "...If You Sailed on the Mayflower in 1620" or "Don\'t Know Much About the Pilgrims" and find one fact that your group didn\'t know and finds interesting. Make a short video explaining the fun fact.',
          points: 500,
          category: 'PHOTO_AND_VIDEO',
        },
        {
          name: 'Groovy Potatoes',
          description:
            "What good is Groovy Gravy without mashed potatoes? It takes 23 potatoes to make a batch of Grandma's Groovy Mashed Potatoes. If there is a shipment of 3,569 potatoes, how many batches of potatoes can be made?",
          points: 200,
          category: 'TEXT',
        },
      ],
    },
  },
  {
    name: 'Toronto landmark hunt',
    description:
      'This interactive quiz tour will take you to all the major landmarks and attractions the city has to offer!',
    missions: {
      create: [
        {
          name: 'The tallest tower',
          description:
            "This building stands above all others downtown and gives a view for miles on its observation deck. You'll need to get within 100m of this tower to complete this mission.",
          points: 200,
          category: 'GPS',
        },
        {
          name: 'Trash Pandas',
          description:
            "Raccoons are some of the city's feistiest residents! Snap a picture of an elusive trash panda to secure these points.",
          points: 500,
          category: 'PHOTO_AND_VIDEO',
        },
      ],
    },
  },
]

export const seed = async () => {
  console.log(`Start seeding ...`)
  for (const data of gameData) {
    const game = await prisma.game.create({
      data,
    })
    console.log(`Created game with id: ${game.id}`)
  }
  console.log(`Seeding finished.`)
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
