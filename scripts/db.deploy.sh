#!/bin/bash

cd ..

docker-compose exec db-api npm run db-deploy

# docker-compose run db-api npm run db-unit-test