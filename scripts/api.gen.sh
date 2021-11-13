#!/bin/bash

cd ..

docker-compose exec db-api npm run api-gen
