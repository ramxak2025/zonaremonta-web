# syntax=docker/dockerfile:1.7
# Multi-stage build: Next.js 15 standalone.
# Строго --frozen-lockfile, workspace-пакеты собираются до Next.
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
ARG CACHE_BUST=2026-04-25-v7-marketing
RUN echo "Build cache bust: ${CACHE_BUST}"
COPY . .
# Сборка workspace-пакетов до next build
RUN pnpm --filter @05auto/shared build
RUN pnpm --filter @05auto/ui build
RUN pnpm --filter @05auto/web build

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
USER app
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
