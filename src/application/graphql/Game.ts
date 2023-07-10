import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql'

export const BaseGameType = new GraphQLObjectType({
  name: 'BaseGame',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
})
