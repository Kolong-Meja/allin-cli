FROM node:23-alpine AS base

FROM base AS deps

WORKDIR /path/to/your-app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod

FROM base AS build

RUN corepack enable

WORKDIR /path/to/your-app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM base

WORKDIR /path/to/your-app

COPY --from=deps /path/to/your-app/node_modules /path/to/your-app/node_modules

COPY --from=build /path/to/your-app/dist /app/dist

ENV NODE_ENV production

CMD ["node", "./dist/index.js"]