# Запуск через Docker

## Требования
- Установлен Docker (https://docs.docker.com/get-docker/)

## Быстрый старт (один контейнер)

```bash
docker build -t debugix .
docker run -d -p 3000:3000 -v debugix-data:/data --name debugix debugix
```

Сайт: http://localhost:3000
База `news.db` сохраняется в Docker-томе `debugix-data` — переживает перезапуск.

## Через docker-compose (проще)

```bash
docker compose up -d --build
```

Остановить:
```bash
docker compose down
```

## Деплой на любой хостинг с поддержкой Docker
(Render, Fly.io, Railway, DigitalOcean, Hetzner, VPS и т.д.)

Хостингу нужно дать только две вещи:
1. Этот Dockerfile (он сам всё установит и соберёт).
2. Persistent volume, примонтированный в `/data` — там лежит SQLite.

Переменные окружения (опционально):
- `PORT` — порт (по умолчанию 3000)
- `DATA_DIR` — путь к папке с БД (по умолчанию `/data` в Docker)
