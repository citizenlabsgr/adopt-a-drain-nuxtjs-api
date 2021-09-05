#source ./__scripts/00.settings.sh

# keep stuff from build docker system prune

docker images

cd ..

if [ ! -f '.env' ] ; then
  echo "  "
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "   You must setup an .env file in folder with docker-compose.yml"
  echo "       Terminating script."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "  "
  exit 1
fi

docker-compose down --remove-orphans

# build everything from scratch...slow but works
echo "Ready to start app"

docker-compose build

docker-compose up --remove-orphans

#open -a safari "http://0.0.0.0:5555/"

# show the environment variables
# docker-compose exec web env
