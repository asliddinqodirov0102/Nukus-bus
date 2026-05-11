from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class StationCreate(BaseModel):
    name: str
    lat: float
    lon: float
    route_refs: Optional[str] = None

class StationResponse(StationCreate):
    id: int
    class Config:
        from_attributes = True

class BusCreate(BaseModel):
    route_num: str
    route_name: str
    driver_phone: str
    is_active: bool = True

class BusResponse(BusCreate):
    id: int
    class Config:
        from_attributes = True

class LocationUpdate(BaseModel):
    bus_id: int
    lat: float
    lon: float
    speed: float = 0.0

class BusStatus(BaseModel):
    bus_id: int
    routeNum: str
    lat: float
    lon: float
    speed: float
    nextStation: Optional[str] = None
    eta: Optional[int] = None

class WSMessage(BaseModel):
    type: str
    buses: List[BusStatus]
