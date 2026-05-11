# ─── Build stage ──────────────────────────────────────────────────────────────
FROM python:3.11-slim AS base

# Tizim paketlari
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Ish papkasi
WORKDIR /app

# Kutubxonalar (Docker cache uchun avval copy)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ilova kodlari
COPY . .

# Ma'lumotlar bazasi papkasi (SQLite fayl uchun)
RUN mkdir -p /data
ENV DB_PATH=/data/nukus_bus.db

# Port
EXPOSE 8000

# Ishga tushirish
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
