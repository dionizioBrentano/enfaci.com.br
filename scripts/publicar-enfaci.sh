#!/bin/bash
# Coloque este arquivo em: /home/postodee/enfaci.com.br/scripts/publicar-enfaci.sh
# No Terminal do cPanel: bash /home/postodee/enfaci.com.br/scripts/publicar-enfaci.sh
# O GitHub precisa ter a pasta dist (build no PC + git add dist + push).
# Este script NAO usa Node.

set -euo pipefail

SITE="/home/postodee/enfaci.com.br"
BRANCH="feat/auth-local"

cd "$SITE"

git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

if [ ! -d dist ] || [ ! -f dist/index.html ]; then
  echo "dist/ ausente no Git. No PC: npm run build && git add dist && git commit && git push"
  exit 1
fi

rm -rf "$SITE/assets"
cp -a dist/. "$SITE/"

echo "publicado $(git log -1 --oneline)"
