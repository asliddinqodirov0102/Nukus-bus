# ── Nukus Bus — Production Dockerfile (repo root) ────────────────────────────
FROM python:3.11-slim

# Tizim paketlari
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Python kutubxonalari (Docker cache uchun avval)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Backend kodi
COPY backend/app ./app

# 3. Frontend statik fayllar (/app/frontend ga)
COPY frontend ./frontend

# 4. Data papkasi (SQLite uchun)
RUN mkdir -p /data
ENV DB_PATH=/data/nukus_bus.db

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
