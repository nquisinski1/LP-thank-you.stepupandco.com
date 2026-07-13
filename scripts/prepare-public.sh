#!/bin/sh
set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_ROOT"

mkdir -p public
COPYFILE_DISABLE=1 rsync -a --delete --delete-excluded --force --exclude '._*' --exclude '.DS_Store' src/ public/
mkdir -p public/media
COPYFILE_DISABLE=1 cp src/assets/stepup-white-20260713.png public/media/brand-white
COPYFILE_DISABLE=1 cp src/assets/harold-hero-296.jpg public/media/hero-stage
COPYFILE_DISABLE=1 cp src/assets/harold-stage.jpg public/media/stage
COPYFILE_DISABLE=1 cp src/assets/harold-candid.jpeg public/media/candid
COPYFILE_DISABLE=1 cp src/assets/harold-authority.jpeg public/media/authority
COPYFILE_DISABLE=1 cp src/assets/harold-investor-report-20260713.jpg public/media/investor-report
COPYFILE_DISABLE=1 cp src/assets/harold-investor-editorial.jpg public/media/investor-editorial
COPYFILE_DISABLE=1 cp src/assets/harold-power.jpeg public/media/power
find public -name '._*' -delete
sh scripts/validate.sh
node scripts/test-public-media.mjs

printf '%s\n' "Public package prepared at $PROJECT_ROOT/public"
