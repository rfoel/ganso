#!/bin/bash

docker compose --file docker-compose.postgres.yml down
docker compose --file docker-compose.dynamo.yml down  