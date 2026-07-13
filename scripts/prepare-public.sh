#!/bin/sh
set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_ROOT"

mkdir -p public
rsync -a --delete --exclude '._*' --exclude '.DS_Store' src/ public/
sh scripts/validate.sh

printf '%s\n' "Public package prepared at $PROJECT_ROOT/public"
