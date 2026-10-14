# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV DATABASE_URL="file:/app/data/snippets.db"
RUN npx prisma generate \
  && npm run build \
  && npm prune --omit=dev

FROM base AS runtime
ENV NODE_ENV=production \
  DATABASE_URL="file:/app/data/snippets.db" \
  PORT=3001
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/prisma*.config.ts ./
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/main.js"]