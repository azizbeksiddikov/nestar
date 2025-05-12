#!/bin/bash

# PRODUCTION
git reseet --hard
git checkout master
git pull origin master

docker compose up -d
