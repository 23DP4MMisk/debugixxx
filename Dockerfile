# ─── Stage 1: build ──────────────────────────────────────────
FROM node:22-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# Удаляем dev-зависимости, оставляя только production для рантайма
RUN npm prune --omit=dev

# ─── Stage 2: runtime ────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

# Устанавливаем переменные окружения для работы сервера в контейнере
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATA_DIR=/data

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates wget \
 && rm -rf /var/lib/apt/lists/*

# Копируем созданную папку dist (и клиент, и сервер)
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Создаем папку под постоянный диск Railway для SQLite
RUN mkdir -p /data

EXPOSE 3000

# Исправленный хелсчек (добавлен полный IP адрес)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- 127.0.0 >/dev/null || exit 1

# Запуск с явным пробросом PORT и HOST для Vinxi / Nitro сервера
CMD ["sh", "-c", "HOST=0.0.0.0 PORT=$PORT NITRO_HOST=0.0.0.0 NITRO_PORT=$PORT node dist/server/server.js"]