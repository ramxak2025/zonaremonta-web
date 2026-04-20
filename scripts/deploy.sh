#!/usr/bin/env bash
# Deploy 05auto.ru на VDS. Выполнять от root или пользователя с docker.
# Usage: ./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== pulling latest =="
git fetch origin
git reset --hard origin/main

echo "== building images =="
docker compose -f docker-compose.prod.yml --env-file .env build --pull

echo "== applying migrations =="
docker compose -f docker-compose.prod.yml --env-file .env run --rm api pnpm prisma migrate deploy

echo "== restarting services =="
docker compose -f docker-compose.prod.yml --env-file .env up -d

echo "== pruning =="
docker image prune -f

echo "== health check =="
sleep 5
curl -fsS http://127.0.0.1:4000/api/v1/health || (echo "API health failed" && exit 1)
curl -fsSI http://127.0.0.1:3000 | head -n1

echo "✅ deploy done"
