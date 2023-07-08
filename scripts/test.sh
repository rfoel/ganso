#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"

source $DIR/set-env.sh

if [[ $DB_STRATEGY == 'postgres' ]]; then
    DB_URL=$POSTGRES_DB_URL
    DOCKER_COMPOSE_FILE="docker-compose.postgres.yml"
elif [[ $DB_STRATEGY == 'dynamo' ]]; then
    DB_URL=$DYNAMO_DB_URL
    DOCKER_COMPOSE_FILE="docker-compose.dynamo.yml"
fi

docker-compose -f $DOCKER_COMPOSE_FILE up -d 

echo 'Waiting for database to be ready...'

$DIR/wait-for-it.sh "${DB_URL}" -t 3 -- echo 'Database is ready!'

npm run migrate

tsx src/main.ts &

echo 'Waiting for server to be ready...'

$DIR/wait-for-it.sh "http://localhost:${PORT}" -t 3 -- echo 'Server is ready!'

vitest --watch=false

echo 'Cleaning up...'

npx kill-port $PORT