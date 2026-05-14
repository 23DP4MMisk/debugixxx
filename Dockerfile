# ─── Stage 1: build ──────────────────────────────────────────
# Переходим на Node 22, так как этого требуют пакеты TanStack Start
FROM node:22-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# Удаляем dev-зависимости, оставляя только production
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

# Копируем результаты сборки TanStack Start / Vinxi
# Если вы используете дефолтный шаблон, билд лежит в .vinxi
COPY --from=build /app/.vinxi ./.vinxi
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

RUN mkdir -p /data

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- 127.0.0 >/dev/null || exit 1

# Запуск сервера TanStack Start
CMD ["node", ".vinxi/build/server/index.mjs"]
