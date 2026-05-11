import math

def calculate_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Kenglik va uzunlik orqali ikki nuqta orasidagi masofani (km) hisoblash
    """
    R = 6371.0 # Yer radiusi (km)

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

def find_nearest_station(bus_lat: float, bus_lon: float, stations: list) -> dict:
    """
    Eng yaqin bekatni topish va ungacha bo'lgan masofani qaytarish
    """
    if not stations:
        return None

    nearest = None
    min_dist = float('inf')

    for st in stations:
        dist = calculate_haversine(bus_lat, bus_lon, st.lat, st.lon)
        if dist < min_dist:
            min_dist = dist
            nearest = st
            
    return {"station": nearest, "distance_km": min_dist}

def calculate_eta(distance_km: float, speed_kmh: float) -> int:
    """
    ETA (taxminiy yetib borish vaqti) minutlarda
    """
    if speed_kmh <= 0 or distance_km < 0.05: # juda yaqin bo'lsa yoki to'xtagan bo'lsa
        return 0
    return int((distance_km / speed_kmh) * 60)
