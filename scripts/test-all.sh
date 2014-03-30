#!/bin/bash

# Some sanity checks to see whether the prerequisites are running
for process in scripts/web-server.js app.js e2eBridge.js; do
    if ! pgrep -f $process > /dev/null; then
        echo "Could not find any process running $process."
        echo "Please start it manually or use scripts/run-all.sh"
        exit 1
    fi
done

# Define reasonable set of browsers in case we are running manually from commandline
if [[ -z "$BROWSERS" ]]; then
  BROWSERS="Firefox"
fi

./node_modules/.bin/protractor config/protractor.conf.js | tee tests.out
./node_modules/karma/bin/karma start config/karma-unit.conf.js --single-run --browsers $BROWSERS | tee -a tests.out

cd ../monkey-tail
./node_modules/.bin/jasmine-node --captureExceptions test/e2e/     | tee -a ../monkey-face/tests.out
./node_modules/.bin/jasmine-node --captureExceptions test/models/  | tee -a ../monkey-face/tests.out

