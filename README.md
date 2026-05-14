# Debugix — News site (TanStack Start + SQLite)

Полнофункциональный сайт новостей. Хранилище — **SQLite** (better-sqlite3).
Новости создаются и удаляются через админку и сразу пропадают со главной.

---

## Требовани

- **Node.js 20 или выше** (`node -v`)
- npm (идёт с Node) или bun
- Для Windows: установлены build tools для нативных модулей
  (`npm install --global windows-build-tools`) — нужны для сборки `better-sqlite3`.
  На Linux/macOS обычно ничего ставить не нужно.

---

## Локальный запуск

```bash
# 1. Установка зависимостей (better-sqlite3 компилируется ~30 сек — это нормально)
npm install

# 2. Режим разработки (hot reload)
npm run dev
# → http://localhost:3000

# 3. Production-сборка и запуск
npm run build
npm start
# → http://localhost:3000
```

База данных создаётся автоматически в `./data/news.db` при первом запуске
и наполняется демо-новостями.

---

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `PORT`     | `3000`       | HTTP-порт сервера |
| `DATA_DIR` | `./data`     | Папка для `news.db`. На хостинге укажи путь к persistent volume |

---

## Деплой на Railway

1. Зайди на [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
   (или **Empty Project** → загрузи код через `railway up` из распакованной папки).
2. Railway сам определит Node-проект (есть `package.json`, `railway.json`,
   `Procfile`). Build: `npm install && npm run build`. Start: `npm start`.
3. **ОБЯЗАТЕЛЬНО**: добавь Volume для базы данных, иначе при каждом
   передеплое новости будут стираться.
   - В сервисе → **Settings → Volumes → New Volume**
   - Mount path: `/data`
   - В **Variables** добавь: `DATA_DIR=/data`
4. **Variables** → `PORT` Railway проставит сам. Ничего больше не нужно.
5. **Settings → Networking → Generate Domain** — получишь публичный URL.

### Команды CLI (опционально)

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

---

## Деплой на другие Node-хосты

Подходит любой хост, поддерживающий **Node.js 20+** и **persistent disk**:
Render, Fly.io, Hetzner, DigitalOcean App Platform, обычный VPS.

Общая схема:
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Persistent volume → смонтировать в путь, который указан в `DATA_DIR`

### ⚠️ НЕ подходит

- **Vercel / Netlify / Cloudflare Pages / Cloudflare Workers** — у них
  serverless/edge runtime без файловой системы; `better-sqlite3` не работает.
  Если нужно туда — менять SQLite на Postgres/Turso/D1.

---

## Структура

```
src/
  routes/           # Страницы (TanStack Router)
    index.tsx       # Главная (последние 3 новости из БД)
    news.index.tsx  # Список всех новостей
    news.$slug.tsx  # Страница новости
    admin.news.tsx  # Админка: добавить / удалить
  lib/
    news-db.server.ts   # SQLite слой (только сервер)
    news.functions.ts   # createServerFn API
    news-store.ts       # Клиентский фасад
    news-data.ts        # Сид-данные
data/
  news.db           # Создаётся автоматически (в .gitignore)
```

---

## Бэкап базы

Файл `data/news.db` — обычный SQLite. Скопируй его, чтобы сделать бэкап.
На Railway — `railway run cat /data/news.db > backup.db` или через Volume snapshot.
