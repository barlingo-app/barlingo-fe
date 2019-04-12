#!/bin/bash

NOW=$(date +"%Y-%m-%d")

if [ "$TRAVIS_BRANCH" == "CI" ]; then
  echo "Deploying $TRAVIS_BRANCH to UAT"
  rm .env
  mv .env-uat .env
  rm -rf build
  npm install
  npm run build
  cd build
  zip -r -q barlingo-fe.zip .
  cd ..
  sshpass -p $UAT_DEPLOY_PASSWORD scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null build/barlingo-fe.zip $UAT_DEPLOY_USER@$UAT_DEPLOY_DOMAIN:~/barlingo-deploy-packages/barlingo-fe-uat/barlingo-fe.zip
  sshpass -p $UAT_DEPLOY_PASSWORD ssh -o StrictHostKeyChecking=no $UAT_DEPLOY_USER@$UAT_DEPLOY_DOMAIN "bash deploy-barlingo-fe.sh UAT $TRAVIS_BRANCH 1> ~/barlingo-deploy-logs/barlingo-fe-uat/deploy-$NOW.log 2>&1"
elif [ "$TRAVIS_TAG" != "" ]; then
  echo "Deploying $TRAVIS_TAG to PRD"
  rm .env
  mv .env-prd .env
  rm -rf build
  npm install
  npm run build
  cd build
  zip -r -q barlingo-fe.zip .
  cd ..
  sshpass -p $PRD_DEPLOY_PASSWORD scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null build/barlingo-fe.zip $PRD_DEPLOY_USER@$PRD_DEPLOY_DOMAIN:~/barlingo-deploy-packages/barlingo-fe-prd/barlingo-fe.zip
  sshpass -p $PRD_DEPLOY_PASSWORD ssh -o StrictHostKeyChecking=no $PRD_DEPLOY_USER@$PRD_DEPLOY_DOMAIN "bash deploy-barlingo-fe.sh PRD $TRAVIS_TAG 1> ~/barlingo-deploy-logs/barlingo-fe-prd/deploy-V$TRAVIS_TAG-$NOW.log 2>&1"
fi

exit 0
