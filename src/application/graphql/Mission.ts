import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from 'graphql'

export const CategoryType = new GraphQLEnumType({
  name: 'Category',
  values: {
    TEXT: { value: 'text' },
    PHOTO_AND_VIDEO: { value: 'photo+video' },
    GPS: { value: 'gps' },
  },
})

export const BaseMissionType = new GraphQLObjectType({
  name: 'BaseMission',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    points: { type: GraphQLInt },
    category: {
      type: CategoryType,
    },
  }),
})
