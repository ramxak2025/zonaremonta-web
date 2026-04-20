# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN apk add --no-cache vips-dev build-base python3 openssl
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY . .
# Собираем shared — его нужно собрать до деплоя, чтобы dist/ попал в бандл
RUN pnpm --filter @05auto/shared build
RUN ls -la /repo/packages/shared/dist
# Генерируем prisma client в node_modules
RUN pnpm --filter @05auto/api exec prisma generate
# Собираем api
RUN pnpm --filter @05auto/api build
RUN ls -la /repo/apps/api/dist && test -f /repo/apps/api/dist/main.js || (echo "ERROR: dist/main.js NOT FOUND" && find /repo/apps/api/dist -type f 2>/dev/null; exit 1)
# pnpm deploy создаёт самостоятельный бандл в /app-deploy с реальными файлами
# (резолвит symlinks pnpm workspace, исключает devDeps)
RUN pnpm --filter @05auto/api deploy --prod /app-deploy
RUN ls -la /app-deploy/node_modules/.bin/ | head -20 && test -x /app-deploy/node_modules/.bin/prisma || (echo "ERROR: prisma bin not found" && exit 1)

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
RUN apk add --no-cache vips tini openssl
WORKDIR /app
COPY --from=build /app-deploy /app

EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main.js"]
