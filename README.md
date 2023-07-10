# ganso 🪿

Ganso (_Portugeese_ word for goose) is part of the take home assignment for [Goosechase](https://www.goosechase.com/) software engineer position.

## Prerequisites

- **Node.js**: v18.16.0
- **npm**: 9.5.1
- **Docker**: 23.0.6

## Getting started

Install dependencies:

```
npm install
```

Start local server:

```
npm run dev
```

The command above will start Docker, migrate the database, seed the database, and start the local server.

## Testing

I am using [vitest](https://vitest.dev/) to test the application. Because I am using Docker for my PostgreSQL instance, there a few things to know before running the tests. To get it going, we need to run the `docker compose up -d` command, it is already done in the file `scripts/test.sh`, but it uses a bash script called `wait-for-it.sh` to wait for the database to be ready. In order to use this script on Mac the following command must be executed:

```
brew install coreutils && alias timeout=gtimeout
```

If `homebrew` is not available, just skip this part and run `docker compose up -d` manually and wait for it to be done.

To run the tests:

```
npm run test
```

The `test` command is basically the `dev` command, but it starts the server in background and then run the `vitest`, to kill the process in the port after the tests are done I am using [kill-port](https://www.npmjs.com/package/kill-port) package. It can be improved, but it gets the job done for now.

## Technologies

For this project, in addition to the required technologies (Express, TypeScript, PostgreSQL), I chose to use [Prisma](https://www.prisma.io/) for the convenience of setting up the database, declaring schemas and automatic generation of TypeScript types. I've also used [Zod](https://zod.dev/) for validating schemas.

## Postman collection

I've integrated this GitHub repository with Postman so I can test the API with the generated [collection](postman/collections/ganso.json) based on the [Open API definition](postman/schemas/index.yaml). It can be imported easily to the Postman app. There is a documentation on how to do it [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

## Apollo Studio

The GraphQL schema can be viewed [here](https://studio.apollographql.com/public/Ganso/variant/current). This is a published version of the schema. It can also be viewed using [Apollo Explorer](https://studio.apollographql.com/sandbox/explorer) with the local server running.

## Possible improvements

- Better error messages. I have done a simple treatment for the errors I could find, it is not the best messages but they are clear about what went wrong;
- Better testing flow. Starting Docker, starting local server, and running the tests can be heavy;
- Integrate [Swagger UI](https://swagger.io/tools/swagger-ui/) to serve a page with the Open API documentation could be useful;
- The environment variables are in the `.env` file, which is not ignored. In a real world scenario this would not be included in the version control;
- Some environment variables could be in the `.env` file too, like `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`;
