from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from contextlib import asynccontextmanager

from .database import engine, Base
from .routers import buses, stations, ws, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create DB tables
    # /data papkasi mavjud bo'lmasa yaratish (Render.com disk)
    db_path = os.environ.get("DB_PATH", "./app.db")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Nukus Bus Monitoring API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS — frontend domenini qo'shing
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(buses.router, prefix="/api/buses", tags=["buses"])
app.include_router(stations.router, prefix="/api/stations", tags=["stations"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

# WebSocket Router
app.include_router(ws.router, prefix="/ws", tags=["websocket"])

@app.get("/api")
def root():
    return {"message": "Nukus Bus Backend Service is running.", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    """Render.com health check endpoint"""
    return JSONResponse(content={"status": "ok", "service": "nukus-bus-api"})

# Mount Frontend Static Files
# Docker da: /app/app/main.py -> ../frontend = /app/frontend ✅
# Lokal da:  backend/app/main.py -> ../../frontend = nukus-bus/frontend ✅
_base = os.path.dirname(__file__)
frontend_path = os.path.abspath(os.path.join(_base, "../frontend"))
if not os.path.exists(frontend_path):
    frontend_path = os.path.abspath(os.path.join(_base, "../../frontend"))

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")


