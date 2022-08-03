#!/bin/bash
#source ./get_input.sh
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

cd ..
ls

# source ./config.sh
source ../../git.config.sh

export MY_TRUNK=${GIT_TRUNK}
export MY_BRANCH=${GIT_BRANCH}
export MY_APPNAME=${GIT_PROJECT}
export MY_PREFIX=${GIT_PREFIX}
export MY_GIT_OWNERNAME=${GIT_OWNERNAME}
export MY_GIT_PROJECT=${GIT_PROJECT}
# export MY_DATA_FOLDER=~/.data/aad_db
# Prerequisites:
#   1. have a cloned repo
#   2. Open a command window
#   3. create a config.sh file

# get a commit message

export MY_GIT_PROJECT=$(get_input "Git.Project.Name" "${MY_GIT_PROJECT}")
export MY_TRUNK=$(get_input "Git.Trunc.Name" "${MY_TRUNK}")
export MY_BRANCH=$(get_input "Your.Branch.Name" "${MY_BRANCH}")
export COMMIT_MSG=$(get_input "Commit.Message" "${MY_BRANCH}")
export PUSH=N
export CONT=N
export CONT=$(get_input "Continue?" "${CONT}")

if [ ${CONT} = "N" ]; then
  echo "Stopping."
  exit 0
fi
echo "Continuing"
ls

# Git Commands#                 Process
# ---------------------------   ---------------------------------   ---------------------
cd ${MY_GIT_PROJECT}/           #
git checkout ${MY_BRANCH}
                                #   +---->[checkout your branch]              git checkout <your-branch-name>
                                #   |               |
                                #   |   |-->[make your changes]
                                #   |   |           |
                                #   |   |           |
git add .
                                #   |   |   [save your changes]                 git add .
git commit -m "${COMMIT_MSG}"
                                #   |   |           |                           git commit -m "#<issue-no>.<description>"
                                #   |   |           |
                                #   |   ^-----------|
                                #   |   |           |
git checkout ${MY_TRUNK}             #   |   |   [get collaborator changes]          git checkout trunk
echo "----"
git pull origin ${MY_TRUNK}          #   |   |           |                           git pull origin trunk
                                #   |   ^-----------|
git checkout ${MY_BRANCH}
git branch
                                #   |   |   [start to merge yours and their changes]            git checkout <your-branch-name>
echo "-- rebase"
# git config --global credential.helper cache # use when PAT is changed
git rebase ${MY_BRANCH}
                                #   |   |           |
                                #   |   |   [fix any conflicts]                 #Use an editor like atom or visual studio
                                #   |   ^-----------|
                                #   |               |
#git status                      #   |       [check your repo's status]          git status
                                #   ^---------------|
#exit 0                          #           [terminate]
                                #               .
                                #               .
                                #               .

export PUSH=$(get_input "PUSH?" "${PUSH}")

if [ ${PUSH} = "N" ]; then
  echo "Remember to Push later."
  exit 0
fi
echo "-- pushing"
git push origin "${MY_BRANCH}"
                                #       [Optionally, push your change to GitHub]
                                #       [Open Github in browser]
open -a safari "https://github.com/${MY_GIT_OWNERNAME}/${MY_GIT_PROJECT}"

git status

# open a browser for convenience
