# Notes

## Category transformation

In the REST controller using the Prisma database(PostgreSQL), the client sends the raw value and I translate it to the Prisma enum, and Prisma takes care of transforming it back to the raw value before saving it to PostgreSQL. I decided to do that transformation in the `/src/infra/repository/prisma/Mission.ts` file because I thought Goosechase might have a test suite apart for validating an candidates submission. When using the DynamoDB strategy, I do not do any transformation.

The GraphQL controller is not "translating" the `category` field back to the "raw" database value, i.e., the user inputs the translated enum, the GraphQL translates the field to be saved in the taw format, and in the way back GraphQL translates it back to the code layer enum.

| raw         | translated      |
| ----------- | --------------- |
| text        | TEXT            |
| photo+video | PHOTO_AND_VIDEO |
| gps         | GPS             |

It is important to notice that in any case, the database value will ALWAYS be the raw value, so in a analytics layer it would always be in the raw form. The GraphQL implementation and the Prisma implementation are basically equal, the only difference is that for the turnaround assignment I decided to translate the values for the reason I explained above.
