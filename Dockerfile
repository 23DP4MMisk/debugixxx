# ─── Stage 1: build ──────────────────────────────────────────
FROM node:22-bookworm AS build
WORKDIR /app

# Передаем переменные уже на этапе сборки (Vinxi впекает их в бандл)
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    NITRO_HOST=0.0.0.0

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build
RUN npm prune --omit=dev

# ─── Stage 2: runtime ────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATA_DIR=/data

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates wget \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

RUN mkdir -p /data

EXPOSE 3000

# Запускаем через командную оболочку, дублируя переменные для Nitro/Vinxi
CMD ["sh", "-c", "HOST=0.0.0.0 PORT=$PORT NITRO_HOST=0.0.0.0 NITRO_PORT=$PORT node dist/server/server.js"]
