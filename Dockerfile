# ─── Stage 1: build ──────────────────────────────────────────
FROM node:20-bookworm AS build
WORKDIR /app

# Используем полный образ bookworm (в нем уже есть python3, make, g++)
# Это экономит время на apt-get update и установку компиляторов

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# Очищаем dev-зависимости и пересобираем только production native-модули прямо здесь
RUN npm prune --omit=dev

# ─── Stage 2: runtime ────────────────────────────────────────
# Используем максимально легкий образ для работы
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

# Устанавливаем только curl/wget для хелсчека, без тяжелых компиляторов!
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates wget \
 && rm -rf /var/lib/apt/lists/*

# Копируем результаты сборки Nuxt
COPY --from=build /app/.output ./.output

# Если better-sqlite3 требует наличия node_modules в рантайме, 
# копируем уже скомпилированные production-зависимости из Stage 1
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Папку /data создавать через RUN mkdir не обязательно, 
# Railway создаст её сам при монтировании Volume, но оставим для структуры
RUN mkdir -p /data

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
