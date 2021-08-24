function get_input()
 {
   # prompt for input
   # $1 is prompt
   # $2 is default value
   local prompt=$1
   local default=$2
   local answer
   prompt+="[${default}]"
   read -p $prompt answer
   if [ "$answer" = "" ]; then
     answer=$default
   fi
   echo $answer
 }

 function is_heroku_app() {
   # check heroku for existance of application
   # $1 is the name of the applicatin to be searched for
   local prj=$1
   local prj_str=$(heroku apps)

   if echo "$prj_str" | grep -q "$prj"; then
     echo "y";
   else
     echo "n";
   fi
 }

 #cd 01_init_API/
 #cd aad-api/
 # assume this script is in app /script folder
 cd ..

 # [* Log into Heroku from script]
 heroku login
 # list your apps
 echo "=== App List ==="
 heroku apps
 echo "=== Git ==="
 git remote --verbose

   #filename="../aad-api.hk.delete.sh"
   # [* Do not overwrite heroku application(s)]
   #if [ -f "${filename}" ]; then
   #   # [* Skip heroku app creation when hk.delete.\<app-heroku-app-name\> exists]
   #   echo " - Skipping heroku aad-api create "
   #   echo " - Skipping heroku git create "
   #else
      #echo "Creating app: aad-api and repo: aad-api-staging"
      echo "Creating app: aad-api"

      if [ $(is_heroku_app "aad-api") != "y" ]; then
        # [* Skip heroku app create when app exists on heroku.com, run aad-api.DELETE.sh to delete app]
        # echo "Skipping aad-api"
        echo "Manually Create aad-api"

      else
         # [* PORT is set by heroku and dosnt need to be set here, but rather determined in the app code]

         # [* Configure HOST environment variable]
         echo "---------- config HOST"
         heroku config:set HOST=0.0.0.0 -a aad-api

         # [* configure NODE_ENV environment variable]
         echo "---------- config NODE_ENV"
         heroku config:set NODE_ENV=production  -a aad-api

         echo "---------- config NPM_CONFIG_PRODUCTION"
         heroku config:set NPM_CONFIG_PRODUCTION=false  -a aad-api

      fi

 #---------------
 # [* Echo the current list of apps]
 heroku apps

 # [* Echo the current list of heroku git repos]
 git remote -v

 # [Open heroku browser]
 open -a safari "https://dashboard.heroku.com/apps"
