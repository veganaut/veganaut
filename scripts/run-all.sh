#!/bin/bash

set -e

ROOT_DIR="$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )"
cd "$ROOT_DIR"

mkdir -p log

node_modules/.bin/gulp dev

(cd app; ../scripts/web-server.js > ../log/webserver.log 2>&1 &)

node_modules/karma/bin/karma start config/karma-unit.conf.js > log/karma.log 2>&1 &

cd ../veganaut-backend
node_modules/.bin/supervisor app.js > ../veganaut/log/app.log 2>&1 &
node_modules/.bin/supervisor e2eBridge.js > ../veganaut/log/e2eBridge.log 2>&1 &

cd ../veganaut

echo "Veganaut dev server ready on http://localhost:8000/"
echo "You might want to run 'npm run serve' to watch less/js/templates and have browsersync"
wait
