@echo off
chcp 65001 >nul
echo ============================================
echo    NUKUS BUS — Lokal Ishga Tushirish
echo ============================================

cd /d "%~dp0backend"

REM Virtual muhit yaratish (agar yo'q bo'lsa)
if not exist ".venv" (
    echo  Kutubxonalar o'rnatilmoqda...
    python -m venv .venv
    .venv\Scripts\pip install -r requirements.txt
)

echo  FastAPI server ishga tushmoqda...
echo  Brauzerda: http://localhost:8000
echo  API Docs:  http://localhost:8000/api/docs
echo  Admin:     http://localhost:8000/admin.html
echo  Login:     admin / nukus2024
echo ============================================
.venv\Scripts\uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
