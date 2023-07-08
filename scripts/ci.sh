#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"

npm run migrate

tsx src/main.ts &

echo 'Waiting for server to be ready...'

$DIR/wait-for-it.sh "http://localhost:${PORT}" -t 3 -- echo 'Server is ready!'

vitest --watch=false

echo 'Cleaning up...'

npx kill-port $PORT