#!/bin/bash

# Some sanity checks to see whether the prerequisites are running
for process in scripts/web-server.js app.js e2eBridge.js; do
    if ! pgrep -qf $process; then
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
./node_modules/.bin/jasmine-node test/e2e/     | tee -a ../monkey-face/tests.out
./node_modules/.bin/jasmine-node test/models/  | tee -a ../monkey-face/tests.out

cd ../monkey-face
TESTS=0; ASSERTIONS=0; FAILURES=0; SKIPPED=0;
for line in `grep -P '^(\x1b\[\d+(;\d+)*\w)?\d+ tests?,' tests.out | sed 's/ /_/g'`; do
	NUMBERS=(`echo $line | grep -o -P '\d+'`)
	TESTS=$(($TESTS + ${NUMBERS[1]}))
	ASSERTIONS=$(($ASSERTIONS + ${NUMBERS[2]}))
	FAILURES=$(($FAILURES + ${NUMBERS[3]}))
	SKIPPED=$(($SKIPPED + ${NUMBERS[3]}))
done;

echo Summary:
if [[ $FAILURES -eq 0 ]]; then
	tput setaf 2
else
	tput setaf 1
fi;
echo $TESTS tests, $ASSERTIONS assertions, $FAILURES failures, $SKIPPED skipped
tput sgr0
