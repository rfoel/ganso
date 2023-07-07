import GameController from 'application/controller/game'
import MissionController from 'application/controller/mission'
// import ExpressAdapter from 'infra/http/ExpressAdapter'
import KoaAdapter from 'infra/http/KoaAdapter'
import GameRepositoryPrisma from 'infra/repository/prisma/game'
import MissionRepositoryPrisma from 'infra/repository/prisma/mission'
// import ZodSchemaValidator from 'infra/schema/ZodSchemaValidator'
import JoiSchemaValidator from 'infra/schema/JoiSchemaValidator'

const gameRepository = new GameRepositoryPrisma()
const missionRepository = new MissionRepositoryPrisma()

// const http = new ExpressAdapter()
const http = new KoaAdapter()

// const schemaValidator = new ZodSchemaValidator()
const schemaValidator = new JoiSchemaValidator()

new GameController(http, gameRepository, schemaValidator)
new MissionController(http, missionRepository, gameRepository, schemaValidator)

http.listen(Number(process.env.PORT))
