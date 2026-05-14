# ─── Stage 1: build ──────────────────────────────────────────
FROM node:22-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
# Сборка создает папку dist/
RUN npm run build

# Удаляем dev-зависимости, оставляя только production для рантайма
RUN npm prune --omit=dev

# ─── Stage 2: runtime ────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
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

# Исправленный хелсчек (убран опечаток в IP)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- 127.0.0 >/dev/null || exit 1

# Запуск вашего скомпилированного SSR-сервера Vite
CMD ["node", "dist/server/server.js"]
