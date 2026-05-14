# ─── Stage 1: build ──────────────────────────────────────────
FROM node:20-bookworm-slim AS build
WORKDIR /app

# Build tools for better-sqlite3 (native module)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# ─── Stage 2: runtime ────────────────────────────────────────
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

# Runtime libs for native sqlite + healthcheck tool
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates wget \
 && rm -rf /var/lib/apt/lists/*

# Re-install only production deps and rebuild native modules
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
 && npm install --omit=dev \
 && apt-get purge -y python3 make g++ && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/* /root/.npm

# Built output
COPY --from=build /app/.output ./.output

# Persistent SQLite volume
RUN mkdir -p /data
// VOLUME ["/data"]

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
