#cd 01_init_API/
 #cd aad-api/
 # assume we are in subfolder of project repo
 cd ..
 #---------------
 # [# Remove a Specific Heroku Application]
 # [* Login to Heroku from script]
 heroku login
 #---------------
 heroku apps
 git remote -v
 #---------------
 #heroku apps:destroy --app "${app}-staging" --confirm "${app}-staging"
 
   echo "del aad-api"
   # [* Destroy the existing app]
   heroku apps:destroy --app "aad-api" --confirm "aad-api"
 
   echo "del aad-api"
   # [* Remove the Git repo]
   git remote rm "aad-api"
 
   echo "del aad-api-staging"
   # [* Remove the Git Staging repo]
   #git remote rm "aad-api-staging"
 
 
 
 #---------------
 # [* Echo the current list of apps]
 # [* Echo the current list of heroku apps]
 heroku apps
 git remote -v
 
 # [Open heroku browser]
 open -a safari "https://dashboard.heroku.com/apps"
 
