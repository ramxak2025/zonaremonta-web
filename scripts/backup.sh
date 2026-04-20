#!/usr/bin/env bash
# Бэкап Postgres. Запускается по cron, например:
#   0 3 * * * /opt/05auto/scripts/backup.sh >> /var/log/05auto-backup.log 2>&1
set -euo pipefail

BACKUP_DIR=/var/backups/05auto
RETAIN_DAYS=30
TS=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

cd "$(dirname "$0")/.."
source .env

OUT="$BACKUP_DIR/pg_${POSTGRES_DB}_${TS}.sql.gz"

docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges \
  | gzip -9 > "$OUT"

echo "backup: $OUT ($(du -h "$OUT" | cut -f1))"

# ротация
find "$BACKUP_DIR" -name 'pg_*.sql.gz' -type f -mtime +"$RETAIN_DAYS" -delete
