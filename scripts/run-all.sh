#!/bin/bash

set -e

ROOT_DIR="$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )"
cd "$ROOT_DIR"

mkdir -p log

function cleanUp() {
  kill `cat log/mongodb.pid`
}

if ! pgrep "mongod" > /dev/null; then
    echo "Starting mongod"
    trap cleanUp EXIT

    mkdir -p mongodb
    mongod --dbpath mongodb --pidfilepath log/mongodb.pid > log/mongodb.log 2>&1 &
fi

(cd app; ../scripts/web-server.js > ../log/webserver.log 2>&1 &)

node_modules/karma/bin/karma start config/karma-unit.conf.js > log/karma.log 2>&1 &

cd ../veganaut-backend
node_modules/.bin/supervisor app.js > ../veganaut/log/app.log 2>&1 &
node_modules/.bin/supervisor e2eBridge.js > ../veganaut/log/e2eBridge.log 2>&1 &

cd ../veganaut

echo "Go to http://localhost:8000/"
wait

