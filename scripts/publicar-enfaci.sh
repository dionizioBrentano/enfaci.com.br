#!/bin/bash
# No cPanel: cd ~/enfaci.com.br && bash scripts/publicar-enfaci.sh

set -euo pipefail

SITE="$HOME/enfaci.com.br"
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
