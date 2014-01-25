#!/bin/bash

set -ex

function cleanUp() {
  kill $WEBSERVER_PID
}

trap cleanUp EXIT

# Define reasonable set of browsers in case we are running manually from commandline
if [[ -z "$BROWSERS" ]]
then
  BROWSERS="Firefox"
fi

if [[ -z "$BROWSERS_E2E" ]]
then
  BROWSERS_E2E="Firefox"
fi

ROOT_DIR=`dirname $0`/..

cd $ROOT_DIR
npm install

./scripts/web-server.js > /dev/null &
WEBSERVER_PID=$!


./node_modules/karma/bin/karma start config/karma-unit.conf.js --single-run --browsers $BROWSERS
./node_modules/karma/bin/karma start config/karma-e2e.conf.js --browsers $BROWSERS_E2E
