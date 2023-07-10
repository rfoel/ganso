import GameController from 'application/controller/Game'
import MissionController from 'application/controller/Mission'
// import ExpressAdapter from 'infra/http/ExpressAdapter'
import KoaAdapter from 'infra/http/KoaAdapter'
import Repository from 'infra/factory/Repository'
import ZodSchemaValidator from 'infra/schema/ZodSchemaValidator'
// import JoiSchemaValidator from 'infra/schema/JoiSchemaValidator'
import GraphQLController from 'application/controller/GraphQL'

// const http = new ExpressAdapter()
const http = new KoaAdapter()

const repository = new Repository(process.env.DB_STRATEGY)

const schemaValidator = new ZodSchemaValidator()
// const schemaValidator = new JoiSchemaValidator()

new GameController(http, repository.game, schemaValidator)
new MissionController(
  http,
  repository.mission,
  repository.game,
  schemaValidator,
)
new GraphQLController(http, repository.game, repository.mission)

http.listen(Number(process.env.PORT))
