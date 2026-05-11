from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Bus
from ..schemas import BusResponse, BusCreate
from typing import List

router = APIRouter()

# For a real system we would use JWT Auth dependencies here.
# Since we are focusing on minimum required for MVP per the prompt changes
# we will just add basic CRUD.

@router.get("/buses", response_model=List[BusResponse])
async def get_all_buses(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bus))
    buses = result.scalars().all()
    return buses

@router.post("/buses", response_model=BusResponse)
async def create_bus(bus: BusCreate, db: AsyncSession = Depends(get_db)):
    new_bus = Bus(
        route_num=bus.route_num,
        route_name=bus.route_name,
        driver_phone=bus.driver_phone,
        is_active=bus.is_active
    )
    db.add(new_bus)
    await db.commit()
    await db.refresh(new_bus)
    return new_bus


# Further Admin CRUD endpoints for Stations, bus creations could live here.
# For now, admin needs bus data to show active ones in the mock dashboard.
