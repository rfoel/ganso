import { Category, Prisma } from '@prisma/client'

const prismaCategories = Prisma.dmmf.datamodel.enums.find(
  (value) => value.name === 'Category',
)?.values as Prisma.DMMF.EnumValue[]

export const getCategory = (category: string) =>
  prismaCategories?.find((c) => c.name === category)?.dbName

export const getPrismaCategory = (category: string) =>
  prismaCategories?.find((c) => c.dbName === category)?.name as Category
