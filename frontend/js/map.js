// Nukus Center Coordinates
const NUKUS_COORD = [42.4611, 59.6167];

// Initialize Map
let map;
let busMarkers = {};
let stationMarkers = [];

// Base setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

function initMap() {
    // Basic Leaflet Map
    map = L.map('map', {
        zoomControl: false // Custom position if needed
    }).setView(NUKUS_COORD, 14);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Initial Theme Tile
    const initialTheme = localStorage.getItem('pref_theme') || 'dark';
    setMapTile(initialTheme);

    // Listen to theme toggle from index.html
    document.addEventListener('themeToggled', (e) => {
        setMapTile(e.detail);
    });

    // Mock Stations data
    loadStations();
}

let currentTileLayer = null;

function setMapTile(theme) {
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }

    if (theme === 'dark') {
        // Deep elegant dark map
        currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });
    } else {
        // Clean bright map for daylight
        currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });
    }

    currentTileLayer.addTo(map);
}

function loadStations() {
    // Nukus seed data according to requirements
    const seedStations = [
        { id: 1, name: "Nukus Vokzali", lat: 42.4533, lon: 59.6097 },
        { id: 2, name: "Markaziy Bozor", lat: 42.4611, lon: 59.6167 },
        { id: 3, name: "Shahar Hokimiyati", lat: 42.4650, lon: 59.6200 },
        { id: 4, name: "Al-Xorazmiy Ko'chasi", lat: 42.4680, lon: 59.6230 },
        { id: 5, name: "Nukus Aeroporti", lat: 42.4884, lon: 59.6233 },
        { id: 6, name: "Dostlik Ko'chasi", lat: 42.4590, lon: 59.6140 },
        { id: 7, name: "Tibbiyot Instituti", lat: 42.4600, lon: 59.6180 },
        { id: 8, name: "Sport Majmuasi", lat: 42.4620, lon: 59.6250 },
        { id: 9, name: "Savitsky Muzeyi", lat: 42.4641, lon: 59.6175 },
        { id: 10, name: "Universitet", lat: 42.4670, lon: 59.6210 }
    ];

    seedStations.forEach(station => {
        // Create custom div icon for station
        const stationIcon = L.divIcon({
            className: 'station-marker',
            html: `<div class="station-icon"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const marker = L.marker([station.lat, station.lon], { icon: stationIcon })
            .addTo(map)
            .bindPopup(`<div class="text-sm font-semibold text-gray-800">${station.name}</div>`);
            
        stationMarkers.push(marker);
    });
}

function updateBusMarker(busId, lat, lon, routeNum, velocity) {
    if (busMarkers[busId]) {
        // Move existing marker smoothly
        busMarkers[busId].setLatLng([lat, lon]);
    } else {
        // Create new Bus Icon
        const busIcon = L.divIcon({
            className: 'bus-marker',
            html: `<div class="bus-icon-container">${routeNum}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16] // Center of the element
        });

        const newMarker = L.marker([lat, lon], { icon: busIcon }).addTo(map);
        newMarker.bindPopup(`
            <div class="p-2 text-gray-800 font-inter">
                <h3 class="font-bold border-b pb-1 mb-1">Avtobus №${routeNum}</h3>
                <p class="text-xs">Speed: ${velocity || 0} km/h</p>
            </div>
        `);
        busMarkers[busId] = newMarker;
    }
}
