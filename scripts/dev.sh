#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"

source $DIR/set-env.sh

docker-compose up -d

echo 'Waiting for database to be ready...'

$DIR/wait-for-it.sh "${DB_URL}" -t 3 -- echo 'Database is ready!'

npm run migrate

npx tsx watch src/main.ts
