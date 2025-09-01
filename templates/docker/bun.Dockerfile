# BASE IMAGE
FROM oven/bun:1 AS base

WORKDIR /path/to/your-app

# STAGE 1: DEPENDENCIES (PROD ONLY!)
FROM base AS deps

COPY package.json bun.lockb ./

RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production

# STAGE 2: BUILDER
FROM base AS builder

COPY package.json bun.lockb ./

RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .

RUN bun run build

# STAGE 3: RUNNER
FROM base AS runner

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /path/to/your-app

COPY --from=deps /path/to/your-app/node_modules ./node_modules

COPY --from=build /path/to/your-app/dist ./dist

COPY --from=build /path/to/your-app/package.json ./package.json
COPY --from=build /path/to/your-app/bun.lockb ./bun.lockb

RUN addgroup -S app && adduser -S -G app app
USER app

ENV PORT=3000
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["bun", "dist/index.js"]