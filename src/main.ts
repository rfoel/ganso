import GameController from 'application/controller/game'
import MissionController from 'application/controller/mission'
// import ExpressAdapter from 'infra/http/ExpressAdapter'
import KoaAdapter from 'infra/http/KoaAdapter'
import gameRepository from 'infra/repository/game'
import missionRepository from 'infra/repository/mission'
// import ZodSchemaValidator from 'infra/schema/ZodSchemaValidator'
import JoiSchemaValidator from 'infra/schema/JoiSchemaValidator'

// const http = new ExpressAdapter()
const http = new KoaAdapter()

// const schemaValidator = new ZodSchemaValidator()
const schemaValidator = new JoiSchemaValidator()

new GameController(http, gameRepository, schemaValidator)
new MissionController(http, missionRepository, gameRepository, schemaValidator)

http.listen(Number(process.env.PORT))
