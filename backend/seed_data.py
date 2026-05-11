import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import engine, Base, AsyncSessionLocal
from app.models import Station, Bus

seed_stations = [
    {"id": 1, "name": "Nukus Vokzali", "lat": 42.4533, "lon": 59.6097, "route_refs": "1"},
    {"id": 2, "name": "Markaziy Bozor", "lat": 42.4611, "lon": 59.6167, "route_refs": "1,4"},
    {"id": 3, "name": "Shahar Hokimiyati", "lat": 42.4650, "lon": 59.6200, "route_refs": "15"},
    {"id": 4, "name": "Al-Xorazmiy Ko'chasi", "lat": 42.4680, "lon": 59.6230, "route_refs": "1,4,15"},
    {"id": 5, "name": "Nukus Aeroporti", "lat": 42.4884, "lon": 59.6233, "route_refs": "4"},
    {"id": 6, "name": "Dostlik Ko'chasi", "lat": 42.4590, "lon": 59.6140, "route_refs": ""},
    {"id": 7, "name": "Tibbiyot Instituti", "lat": 42.4600, "lon": 59.6180, "route_refs": ""},
    {"id": 8, "name": "Sport Majmuasi", "lat": 42.4620, "lon": 59.6250, "route_refs": ""},
    {"id": 9, "name": "Savitsky Muzeyi", "lat": 42.4641, "lon": 59.6175, "route_refs": "15"},
    {"id": 10, "name": "Universitet", "lat": 42.4670, "lon": 59.6210, "route_refs": "15"}
]

seed_buses = [
    {"id": 1, "route_num": "1", "route_name": "Vokzal - Bozor", "driver_phone": "+998 90 123 45 67"},
    {"id": 2, "route_num": "4", "route_name": "Aeroport - Markaz", "driver_phone": "+998 91 987 65 43"},
    {"id": 3, "route_num": "15", "route_name": "Universitet", "driver_phone": "+998 93 222 33 44"}
]

async def seed():
    # Setup DB structure
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        st_count = await db.execute(text("SELECT COUNT(id) FROM stations"))
        if st_count.scalar() > 0:
            print("Database already seeded")
            return

        for st in seed_stations:
            db.add(Station(**st))
            
        for bs in seed_buses:
            db.add(Bus(**bs))

        await db.commit()
        print("Successfully seeded initial stations & buses data in SQLite!")

if __name__ == "__main__":
    asyncio.run(seed())
