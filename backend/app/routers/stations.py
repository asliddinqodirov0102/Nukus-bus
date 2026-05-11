from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Station
from ..schemas import StationResponse

router = APIRouter()

@router.get("/", response_model=list[StationResponse])
async def get_stations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Station))
    stations = result.scalars().all()
    return stations
