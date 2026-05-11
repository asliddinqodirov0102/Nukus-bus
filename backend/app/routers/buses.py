from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Bus, BusLocation, Station
from ..schemas import LocationUpdate
from ..utils.haversine import find_nearest_station, calculate_eta
from .ws import manager
import datetime

router = APIRouter()

# In-memory store for active buses status between DB commits
active_buses_cache = {}

@router.post("/update-location")
async def update_location(data: LocationUpdate, db: AsyncSession = Depends(get_db)):
    # 1. Verify bus
    result = await db.execute(select(Bus).where(Bus.id == data.bus_id))
    bus = result.scalars().first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    # 2. Add location to history
    loc = BusLocation(
        bus_id=data.bus_id,
        lat=data.lat,
        lon=data.lon,
        speed=data.speed,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(loc)
    await db.commit()

    # 3. Calculate ETA and Next Station
    st_result = await db.execute(select(Station))
    stations = st_result.scalars().all()
    
    nearest_info = find_nearest_station(data.lat, data.lon, stations)
    station_name = nearest_info["station"].name if nearest_info and nearest_info["station"] else None
    
    eta_mins = 0
    if nearest_info and nearest_info["distance_km"]:
        eta_mins = calculate_eta(nearest_info["distance_km"], data.speed)

    # 4. Cache for WS broadcast
    bus_status = {
        "bus_id": bus.id,
        "routeNum": bus.route_num,
        "lat": data.lat,
        "lon": data.lon,
        "speed": data.speed,
        "nextStation": station_name,
        "eta": eta_mins
    }
    active_buses_cache[bus.id] = bus_status

    # 5. Broadcast to WebSockets
    await manager.broadcast({
        "type": "bus_update",
        "buses": list(active_buses_cache.values())
    })

    return {"status": "ok", "bus_status": bus_status}

@router.get("/")
async def get_all_buses_status():
    return list(active_buses_cache.values())
