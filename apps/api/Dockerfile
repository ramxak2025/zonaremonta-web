# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
# libvips для sharp
RUN apk add --no-cache vips-dev build-base python3
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY . .
RUN pnpm --filter @05auto/api exec prisma generate
RUN pnpm --filter @05auto/api build

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
RUN apk add --no-cache vips tini
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/prisma ./prisma
COPY --from=build /repo/apps/api/package.json ./
COPY --from=build /repo/packages/shared ./node_modules/@05auto/shared
COPY --from=build /repo/node_modules ./node_modules

EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]
