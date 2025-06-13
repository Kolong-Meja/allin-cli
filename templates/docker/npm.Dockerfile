# Please visit https://docs.docker.com/reference/dockerfile/ to gain more information about Dockerfile.

# See also https://stackoverflow.com/questions/26077543/how-to-name-dockerfiles

# You can change all of the setup on this file, so enjoy it!
FROM node:22-alpine AS builder

WORKDIR /path/to/your-app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /path/to/your-app

COPY --from=builder /path/to/your-app/dist ./dist
COPY --from=builder /path/to/your-app/package*.json ./

RUN npm ci --omit=dev

# non-root for security
RUN addgroup -S app && adduser -S -G app app
USER app

ENV PORT=3000
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/index.js"]