#!/usr/bin/env bash
# scripts/deploy-admin.sh — разворачивание админки одной командой.
# Безопасно перезапускать.

set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env"
DEFAULT_PASSWORD="ZRmaster2026"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Файл .env не найден. Создайте его (cp .env.example .env) и заполните." >&2
  exit 1
fi

# ───── Чистим пустые/невалидные строки ADMIN_PASSWORD и ADMIN_SECRET ─────
# (например, если кто-то оставил `ADMIN_PASSWORD=` без значения)
sed -i.bak '/^ADMIN_PASSWORD=$/d;/^ADMIN_SECRET=$/d' "$ENV_FILE" || true

# ───── ADMIN_PASSWORD ─────
CURRENT_PWD=$(grep '^ADMIN_PASSWORD=' "$ENV_FILE" | head -n1 | cut -d= -f2- || true)
if [ -n "$CURRENT_PWD" ]; then
  echo "✅ ADMIN_PASSWORD уже задан в .env (длина: ${#CURRENT_PWD})"
  ADMIN_PWD="$CURRENT_PWD"
else
  printf '\nADMIN_PASSWORD=%s\n' "$DEFAULT_PASSWORD" >> "$ENV_FILE"
  echo "🔐 ADMIN_PASSWORD добавлен в .env: ${DEFAULT_PASSWORD}"
  ADMIN_PWD="$DEFAULT_PASSWORD"
fi

# ───── ADMIN_SECRET ─────
CURRENT_SECRET=$(grep '^ADMIN_SECRET=' "$ENV_FILE" | head -n1 | cut -d= -f2- || true)
if [ -n "$CURRENT_SECRET" ] && [ "${#CURRENT_SECRET}" -ge 16 ]; then
  echo "✅ ADMIN_SECRET уже задан в .env"
else
  SECRET="$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | xxd -p -c 64)"
  # удалим старый невалидный, если был
  sed -i.bak '/^ADMIN_SECRET=/d' "$ENV_FILE"
  printf 'ADMIN_SECRET=%s\n' "$SECRET" >> "$ENV_FILE"
  echo "🔐 ADMIN_SECRET сгенерирован и записан в .env"
fi

rm -f "${ENV_FILE}.bak"

# ───── Volume-директории ─────
mkdir -p /var/lib/05auto/web-content /var/lib/05auto/web-uploads/works
# UID/GID 1000:1000 = пользователь app в контейнере (alpine adduser)
chown -R 1000:1000 /var/lib/05auto/web-content /var/lib/05auto/web-uploads
echo "📁 Volume-директории готовы: /var/lib/05auto/web-content и /var/lib/05auto/web-uploads"

# ───── Пересобираем web и поднимаем стек ─────
echo "🚀 Пересобираю web с актуальным кодом (это займёт ~5 минут)..."
docker compose -f docker-compose.prod.yml --env-file .env build --no-cache web
docker compose -f docker-compose.prod.yml --env-file .env up -d
docker image prune -f >/dev/null

# ───── Проверка что web реально получил пароль ─────
echo ""
echo "🔍 Проверка переменных в контейнере web:"
sleep 3
docker compose -f docker-compose.prod.yml exec -T web sh -c '
  echo "  ADMIN_PASSWORD длина: ${#ADMIN_PASSWORD}"
  echo "  ADMIN_SECRET длина:   ${#ADMIN_SECRET}"
' || echo "  (не удалось выполнить exec — контейнер ещё запускается)"

# ───── Лог запуска ─────
echo ""
echo "📜 Последние логи web (источник пароля):"
docker compose -f docker-compose.prod.yml logs --tail 20 web 2>&1 | grep -E 'admin-auth|ready|started' || true

# ───── Итог ─────
HOST_IP=$(curl -s --max-time 3 ifconfig.me 2>/dev/null || echo "<your-vds-ip>")
cat <<EOF

═══════════════════════════════════════════════════════
✅ Готово!

Админка:  http://${HOST_IP}/admin/login

Логин:    admin (поле логина в форме нет, проверяется только пароль)
Пароль:   ${ADMIN_PWD}

Чтобы поменять пароль:
  1. Отредактируйте ADMIN_PASSWORD в /opt/05auto/.env
  2. docker compose -f docker-compose.prod.yml --env-file .env restart web
═══════════════════════════════════════════════════════
EOF
