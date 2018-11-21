#!/bin/bash

set -e

ROOT_DIR="$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )"
cd "$ROOT_DIR"

mkdir -p log

node_modules/.bin/gulp dev

(cd app; ../scripts/web-server.js)
