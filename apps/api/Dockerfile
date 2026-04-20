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
# сначала собираем shared (он нужен api как скомпилированный пакет)
RUN pnpm --filter @05auto/shared build
RUN ls -la /repo/packages/shared/dist
RUN pnpm --filter @05auto/api exec prisma generate
RUN pnpm --filter @05auto/api build
RUN ls -la /repo/apps/api/dist && test -f /repo/apps/api/dist/main.js || (echo "ERROR: dist/main.js NOT FOUND" && find /repo/apps/api/dist -type f 2>/dev/null; exit 1)

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
RUN apk add --no-cache vips tini openssl
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/prisma ./prisma
COPY --from=build /repo/apps/api/package.json ./
COPY --from=build /repo/packages/shared/dist ./node_modules/@05auto/shared/dist
COPY --from=build /repo/packages/shared/package.json ./node_modules/@05auto/shared/package.json
COPY --from=build /repo/node_modules ./node_modules

EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]
