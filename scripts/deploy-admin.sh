#!/usr/bin/env bash
# scripts/deploy-admin.sh — разворачивание админки и фронта на VDS одной командой.
# Безопасно перезапускать: добавляет ADMIN_PASSWORD/ADMIN_SECRET в .env,
# создаёт volume-директории, пересобирает образ web и запускает.

set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env"
DEFAULT_PASSWORD="Master2026-ZR!"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Файл .env не найден. Создайте его (cp .env.example .env) и заполните." >&2
  exit 1
fi

# ───── ADMIN_PASSWORD ─────
if grep -q '^ADMIN_PASSWORD=' "$ENV_FILE"; then
  echo "✅ ADMIN_PASSWORD уже задан в .env"
else
  echo "ADMIN_PASSWORD=${DEFAULT_PASSWORD}" >> "$ENV_FILE"
  echo "🔐 ADMIN_PASSWORD добавлен в .env: ${DEFAULT_PASSWORD}"
fi

# ───── ADMIN_SECRET ─────
if grep -q '^ADMIN_SECRET=' "$ENV_FILE"; then
  echo "✅ ADMIN_SECRET уже задан в .env"
else
  SECRET="$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | xxd -p -c 32)"
  echo "ADMIN_SECRET=${SECRET}" >> "$ENV_FILE"
  echo "🔐 ADMIN_SECRET сгенерирован и записан в .env"
fi

# ───── Volume-директории ─────
sudo mkdir -p /var/lib/05auto/web-content /var/lib/05auto/web-uploads/works
sudo chown -R 1000:1000 /var/lib/05auto/web-content /var/lib/05auto/web-uploads
echo "📁 Volume-директории готовы: /var/lib/05auto/web-content и /var/lib/05auto/web-uploads"

# ───── Пересобираем web и поднимаем стек ─────
echo "🚀 Пересобираю web с актуальным кодом..."
docker compose -f docker-compose.prod.yml --env-file .env build --no-cache web
docker compose -f docker-compose.prod.yml --env-file .env up -d
docker image prune -f >/dev/null

# ───── Итог ─────
ADMIN_PWD=$(grep '^ADMIN_PASSWORD=' "$ENV_FILE" | cut -d= -f2-)
PORT=$(grep '^WEB_PORT=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- || echo 3000)
HOST_IP=$(curl -s ifconfig.me 2>/dev/null || echo "<your-vds-ip>")

cat <<EOF

═══════════════════════════════════════════════════════
✅ Готово!

Админка:  http://${HOST_IP}/admin/login
          (или через домен, если настроен nginx)

Логин:    admin
Пароль:   ${ADMIN_PWD}

Чтобы поменять пароль — отредактируйте ADMIN_PASSWORD в .env
и перезапустите:  docker compose -f docker-compose.prod.yml --env-file .env restart web
═══════════════════════════════════════════════════════
EOF
