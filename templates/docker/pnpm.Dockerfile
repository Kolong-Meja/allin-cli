# Please visit https://docs.docker.com/reference/dockerfile/ to gain more information about Dockerfile.

# See also https://stackoverflow.com/questions/26077543/how-to-name-dockerfiles

# You can change all of the setup on this file, so enjoy it!
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