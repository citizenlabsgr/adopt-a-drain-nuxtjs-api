#!/bin/bash

cd ..

docker-compose exec db-api npm run db-tests

#docker-compose run db-api npm run db-unit-test