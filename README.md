# Nukus Bus — Real-vaqt Avtobus Monitoring Tizimi 🚌

Nukus shahri uchun real-vaqt avtobus monitoring va boshqaruv tizimi.

## 🚀 Xususiyatlar

- 🗺️ Real-vaqt GPS kuzatuv (Leaflet.js + WebSocket)
- 🚌 Avtobus va marshrutlarni boshqarish
- 👤 Admin panel (JWT autentifikatsiya)
- 📊 Kunlik masofa hisoboti
- 🌙 Qorong'u/Yorug' rejim
- 🌐 Ko'p tilli interfeys (O'zbek/Rus)

## 🛠️ Texnologiyalar

- **Backend**: FastAPI + SQLite + WebSocket
- **Frontend**: HTML/CSS/JavaScript (Vanilla)
- **Proxy**: Nginx
- **Deploy**: Render.com (Docker)

## 📦 Lokal ishga tushirish

```bash
# Docker orqali
docker-compose up --build

# Yoki to'g'ridan-to'g'ri
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 🌐 Deploy

Loyiha [Render.com](https://render.com) da joylashgan:

- **Backend API**: `https://nukus-bus-api.onrender.com`
- **Frontend**: `https://nukus-bus.onrender.com`

## 📡 API Docs

Swagger UI: `https://nukus-bus-api.onrender.com/api/docs`

## 📁 Loyiha Strukturasi

```
nukus-bus/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── routers/
│   │   └── utils/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/          # Statik HTML/CSS/JS
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   └── js/
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

## 👤 Admin kirish

- **Login**: `admin`
- **Parol**: `admin123`

> ⚠️ Production da parolni o'zgartiring!
