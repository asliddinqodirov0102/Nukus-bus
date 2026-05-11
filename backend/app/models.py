from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    route_num = Column(String, index=True)
    route_name = Column(String)
    driver_phone = Column(String)
    is_active = Column(Boolean, default=True)

    locations = relationship("BusLocation", back_populates="bus")

class BusLocation(Base):
    __tablename__ = "bus_locations"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"))
    lat = Column(Float)
    lon = Column(Float)
    speed = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    bus = relationship("Bus", back_populates="locations")

class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    lat = Column(Float)
    lon = Column(Float)
    route_refs = Column(String) # e.g. "1,4,15"
