#!/bin/bash

# Pull newest source
git pull

# Get current running container version
current_version=`docker ps --filter name=dominus --format {{.Image}} | cut -d ":" -f2`

# Get package.json version
pkg_version=`bash version.sh`


if [ $current_version = $pkg_version ]
then
  echo "Version $pkg_version already exists"
  echo "Deployment aborted"
else
  echo "------ Deployment started ------"
  docker build -t panen/dominus:$pkg_version .
  docker stop dominus
  docker rm dominus
  docker run --name dominus -d panen/dominus:$pkg_version  
fi