# DEPLOY — 05auto.ru на VDS

## Требования VDS

- Ubuntu 22.04 / Debian 12
- 2+ vCPU, 2+ GB RAM, 40+ GB SSD
- Публичный IP, A-запись `05auto.ru` и `www.05auto.ru`
- Открыты порты 80, 443

## Первичная установка

```bash
# От root
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# Создаём директории
mkdir -p /opt /var/lib/05auto/uploads /var/lib/05auto/postgres /var/lib/05auto/redis /var/backups/05auto
chown -R 1000:1000 /var/lib/05auto/uploads

# Клон
cd /opt
git clone https://github.com/ramxak2025/zonaremonta-web.git 05auto
cd 05auto

# .env
cp .env.example .env
# !!! отредактируйте .env — сгенерируйте JWT-секреты:
#   JWT_ACCESS_SECRET=$(openssl rand -base64 48)
#   JWT_REFRESH_SECRET=$(openssl rand -base64 48)
# Заполните SMSC_LOGIN/SMSC_PASSWORD, NEXT_PUBLIC_PHONE и т.п.
nano .env
```

## HTTPS и Nginx

```bash
# Nginx конфиг
cp infra/nginx/05auto.conf /etc/nginx/sites-available/05auto.conf
ln -sf /etc/nginx/sites-available/05auto.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Сертификат (откроет 80-й порт на время проверки)
certbot --nginx -d 05auto.ru -d www.05auto.ru --agree-tos -m admin@05auto.ru --no-eff-email

# Авто-обновление
systemctl enable --now certbot.timer

nginx -t && systemctl reload nginx
```

## Запуск приложения

```bash
cd /opt/05auto
docker compose -f docker-compose.prod.yml --env-file .env build
docker compose -f docker-compose.prod.yml --env-file .env up -d

# Миграции и seed (один раз)
docker compose -f docker-compose.prod.yml --env-file .env run --rm api sh -c "pnpm prisma migrate deploy && pnpm prisma db seed"

# Создаём директора
docker compose -f docker-compose.prod.yml --env-file .env exec api \
  pnpm tsx /app/../../scripts/create-admin.ts director@05auto.ru 'СтойкийПароль123!'
```

## Проверка

```bash
curl https://05auto.ru/api/v1/health    # {"status":"ok",...}
curl -I https://05auto.ru                # 200 OK
```

## Обновление (при пуше новой версии)

```bash
cd /opt/05auto
./scripts/deploy.sh
```

Скрипт: `git reset --hard origin/main` → rebuild → `prisma migrate deploy` → `up -d` → health-check.

## Бэкапы

```bash
# Cron: ежедневно в 03:00
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/05auto/scripts/backup.sh >> /var/log/05auto-backup.log 2>&1") | crontab -
```

Хранятся в `/var/backups/05auto`, ротация 30 дней.

## Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

## Траблшутинг

| Симптом | Где смотреть |
|---------|--------------|
| 502 / 504 | `docker compose logs api` / `docker compose logs web` |
| Ошибки миграции | `docker compose run --rm api pnpm prisma migrate status` |
| SMS не доходят | логи api, проверить SMSC_LOGIN |
| Нет места на диске | `/var/lib/docker`, сжать/почистить старые образы |
| Не отдаются картинки | права на `/var/lib/05auto/uploads` и alias в nginx |
