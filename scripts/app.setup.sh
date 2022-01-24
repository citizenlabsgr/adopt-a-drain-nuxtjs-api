#!/bin/bash

cd ..

docker-compose exec db-api npm run app-setup
