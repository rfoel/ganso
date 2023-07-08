#!/usr/bin/env bash

if [[ $DB_STRATEGY == 'postgres' ]]; then
    npx prisma migrate reset -f
elif [[ $DB_STRATEGY == 'dynamo' ]]; then
    npx tsx database/dynamoDB/seed.ts
fi
