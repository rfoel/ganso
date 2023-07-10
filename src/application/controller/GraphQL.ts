import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql'

import CreateGame from 'application/usecases/CreateGame'
import CreateMission from 'application/usecases/CreateMission'
import GameRepository from 'domain/repository/Game'
import GetGame from 'application/usecases/GetGame'
import GetGames from 'application/usecases/GetGames'
import GetMission from 'application/usecases/GetMission'
import GetMissions from 'application/usecases/GetMissions'
import MissionRepository from 'domain/repository/Mission'
import UpdateGame from 'application/usecases/UpdateGame'
import { BaseGameType } from 'application/graphql/Game'
import { BaseMissionType, CategoryType } from 'application/graphql/Mission'
import Http from 'infra/http/Http'

export default class GraphQLController {
  schema: any

  constructor(
    readonly http: Http,
    readonly gameRepository: GameRepository,
    readonly missionRepository: MissionRepository,
  ) {
    const createGame = new CreateGame(gameRepository)
    const updateGame = new UpdateGame(gameRepository)
    const createMission = new CreateMission(missionRepository, gameRepository)
    const getGame = new GetGame(gameRepository)
    const getMissions = new GetMissions(missionRepository)
    const getGames = new GetGames(gameRepository)
    const getMission = new GetMission(missionRepository)

    const GameType = new GraphQLObjectType({
      name: 'Game',
      fields: () => ({
        ...BaseGameType.toConfig().fields,
        missions: {
          type: new GraphQLList(BaseMissionType),
          resolve: async (source) => {
            return getMissions.execute(Number(source.id))
          },
        },
      }),
    })

    const MissionType = new GraphQLObjectType({
      name: 'Mission',
      fields: () => ({
        ...BaseMissionType.toConfig().fields,
        game: {
          type: BaseGameType,
          resolve: async (source) => {
            return getGame.execute(Number(source.gameId))
          },
        },
      }),
    })

    const Game = {
      type: GameType,
      args: {
        gameId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args) => {
        return getGame.execute(Number(args.gameId))
      },
    }

    const Games = {
      type: new GraphQLList(GameType),
      resolve: async () => {
        return getGames.execute()
      },
    }

    const Mission = {
      type: MissionType,
      args: {
        gameId: { type: new GraphQLNonNull(GraphQLID) },
        missionId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args) => {
        return getMission.execute(Number(args?.gameId), Number(args?.missionId))
      },
    }

    const Missions = {
      type: new GraphQLList(MissionType),
      args: {
        gameId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args) => {
        return getMissions.execute(Number(args?.gameId))
      },
    }

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
          game: Game,
          games: Games,
          mission: Mission,
          missions: Missions,
        }),
      }),
      mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          createGame: {
            type: BaseGameType,
            args: {
              name: { type: new GraphQLNonNull(GraphQLString) },
              description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (source, args) => {
              return createGame.execute(args.name, args.description)
            },
          },
          updateGame: {
            type: GameType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
              name: { type: GraphQLString },
              description: { type: GraphQLString },
            },
            resolve: (source, args) => {
              return updateGame.execute(
                Number(args.id),
                args.name,
                args.description,
              )
            },
          },
          createMission: {
            type: BaseMissionType,
            args: {
              name: { type: new GraphQLNonNull(GraphQLString) },
              description: { type: new GraphQLNonNull(GraphQLString) },
              points: { type: new GraphQLNonNull(GraphQLInt) },
              category: { type: new GraphQLNonNull(CategoryType) },
              gameId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: (source, args) => {
              return createMission.execute(
                args.name,
                args.description,
                args.points,
                args.category,
                Number(args.gameId),
              )
            },
          },
        },
      }),
    })

    http.graphql(schema)
  }
}
