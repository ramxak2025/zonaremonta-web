# syntax=docker/dockerfile:1.7
# Multi-stage build: NestJS api + скомпилированный seed.
# - Никаких глобальных рантайм-утилит (tsx/ts-node): seed компилируется заранее.
# - pnpm deploy собирает stand-alone бандл из monorepo (реальные файлы, не symlinks).
# - Строго --frozen-lockfile; без silent-install-фолбэков.

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN apk add --no-cache vips-dev build-base python3 openssl
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# 1. shared — нужен собранный JS до компиляции api (api импортирует @05auto/shared)
RUN pnpm --filter @05auto/shared build
# 2. Prisma client (генерируется в node_modules/@prisma/client)
RUN pnpm --filter @05auto/api exec prisma generate
# 3. API main build → apps/api/dist/
RUN pnpm --filter @05auto/api build
RUN test -f apps/api/dist/main.js
# 4. Seed build → apps/api/dist-seed/seed.js (чистый JS, запускается через `node`)
RUN pnpm --filter @05auto/api run build:seed
RUN test -f apps/api/dist-seed/seed.js
# 5. Deployable prod bundle
RUN pnpm --filter @05auto/api deploy --prod /app-deploy
RUN test -x /app-deploy/node_modules/.bin/prisma

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
RUN apk add --no-cache vips tini openssl
WORKDIR /app
COPY --from=build /app-deploy /app

EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main.js"]
