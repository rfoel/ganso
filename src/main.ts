import GameController from 'application/controller/game'
import MissionController from 'application/controller/mission'
import Express from 'infra/http/Express'
import GameRepositoryPrisma from 'infra/repository/prisma/game'
import MissionRepositoryPrisma from 'infra/repository/prisma/mission'
import ZodSchemaValidator from 'infra/schema/Zod'

const gameRepository = new GameRepositoryPrisma()
const missionRepository = new MissionRepositoryPrisma()

const http = new Express()

const schemaValidator = new ZodSchemaValidator()

new GameController(http, gameRepository, schemaValidator)
new MissionController(http, missionRepository, gameRepository, schemaValidator)

http.listen(Number(process.env.PORT))
