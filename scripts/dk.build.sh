#scripts/dk.build.sh
cd ..
docker build --force-rm -t citizenlabsgr/adopt-a-drain-hapi-api .

docker images 
