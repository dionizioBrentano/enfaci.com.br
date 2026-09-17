#!/usr/bin/env bash
# Publicar enfaci.com.br
# RODA SÓ NO COMPUTADOR LOCAL (tem Node). O servidor NÃO tem Node.
# Uso, na pasta do front:
#   chmod +x scripts/publicar-enfaci.sh
#   ./scripts/publicar-enfaci.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm nao encontrado neste computador. Este script nao roda no cPanel."
  exit 1
fi

if [ ! -f .env ]; then
  echo "Crie .env nesta pasta ANTES do build."
  echo "VITE_API_URL=https://api.postodeenfermagem.com.br"
  echo "VITE_TENANT_ID=<uuid-do-tenant>"
  exit 1
fi

if ! grep -q 'VITE_API_URL=https://api.postodeenfermagem.com.br' .env; then
  echo "AVISO: VITE_API_URL no .env nao aponta para a API de producao."
fi

echo "==> build local"
npm run build

if [ ! -d dist ]; then
  echo "dist/ nao foi gerado"
  exit 1
fi

REMOTE_USER="${REMOTE_USER:-postodee}"
REMOTE_HOST="${REMOTE_HOST:-host4527}"
REMOTE_PATH="${REMOTE_PATH:-enfaci.com.br}"

echo "==> enviando dist/ para ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
echo "    Se o SSH pedir senha, e o login do cPanel."

if command -v rsync >/dev/null 2>&1; then
  rsync -avz --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
else
  scp -r dist/. "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
fi

echo "OK. Abra https://enfaci.com.br/login"
