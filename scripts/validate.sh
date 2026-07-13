#!/bin/sh
set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_ROOT"

node --check src/script.js
node scripts/validate.mjs
node scripts/test-tracking.mjs
